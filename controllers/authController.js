const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const User = require('../models/User');
const Organization = require('../models/Organization');

exports.register = async (req, res) => {
    const { orgName, username, email, password } = req.body;

    if (!orgName || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Create Organization
        const [orgResult] = await connection.query(
            'INSERT INTO organizations (name) VALUES (?)',
            [orgName]
        );
        const organizationId = orgResult.insertId;

        // 2. Create User (Hash password manual here or use User.create adapted for transaction? 
        // Ideally User.create uses the pool. For transaction, we should pass connection.
        // Simplifying: User.create uses default pool. Using connection directly here for atomicity.)

        // We'll duplicate hash logic here for transactional safety or refactor model to accept connection.
        // Let's refactor model usage for simplicity and safety: do manual insert here to ensure same connection.
        const hashedPassword = await bcrypt.hash(password, 10);
        const [userResult] = await connection.query(
            'INSERT INTO users (organization_id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [organizationId, username, email, hashedPassword, 'admin']
        );

        await connection.commit();

        res.status(201).json({
            message: 'Organization and Admin user created successfully',
            organizationId,
            userId: userResult.insertId
        });

    } catch (error) {
        await connection.rollback();
        console.error('Register Error:', error);
        res.status(500).json({ error: 'Registration failed', details: error.message });
    } finally {
        connection.release();
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                organizationId: user.organization_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, role: user.role });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.createUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    const { organizationId } = req.user;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ensure role is valid, default to user if not provided or invalid
        const validRoles = ['admin', 'user'];
        const userRole = validRoles.includes(role) ? role : 'user';

        const [result] = await db.query(
            'INSERT INTO users (organization_id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [organizationId, username, email, hashedPassword, userRole]
        );

        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId,
            username,
            email,
            role: userRole
        });
    } catch (error) {
        console.error('Create User Error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
};

exports.listUsers = async (req, res) => {
    const { organizationId } = req.user;

    try {
        const [users] = await db.query(
            'SELECT id, username, email, role, created_at FROM users WHERE organization_id = ? ORDER BY created_at DESC',
            [organizationId]
        );
        res.json(users);
    } catch (error) {
        console.error('List Users Error:', error);
        res.status(500).json({ error: 'Failed to list users' });
    }
};
