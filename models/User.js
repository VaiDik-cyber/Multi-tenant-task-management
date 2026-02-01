const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async create({ organization_id, username, email, password, role = 'user' }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (organization_id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [organization_id, username, email, hashedPassword, role]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }
}

module.exports = User;
