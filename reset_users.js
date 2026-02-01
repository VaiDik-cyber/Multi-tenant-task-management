const db = require('./config/db');
const bcrypt = require('bcryptjs');

const resetCredentials = async () => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const connection = await db.getConnection();

        console.log('Resetting credentials...');

        // 1. Ensure Organization exists
        await connection.query(`
            INSERT INTO organizations (id, name) VALUES (1, 'TechCorp')
            ON DUPLICATE KEY UPDATE name = 'TechCorp'
        `);

        // 2. Upsert Admin User
        await connection.query(`
            INSERT INTO users (id, organization_id, username, email, password_hash, role)
            VALUES (1, 1, 'admin', 'admin@example.com', ?, 'admin')
            ON DUPLICATE KEY UPDATE password_hash = ?
        `, [hashedPassword, hashedPassword]);

        // 3. Upsert Member User
        await connection.query(`
            INSERT INTO users (id, organization_id, username, email, password_hash, role)
            VALUES (2, 1, 'member', 'member@example.com', ?, 'user')
            ON DUPLICATE KEY UPDATE password_hash = ?
        `, [hashedPassword, hashedPassword]);

        console.log('\n✅ Credentials Updated Successfully!');
        console.log('---------------------------------------------------');
        console.log('👤 Admin User:   admin@example.com  / password123');
        console.log('👤 Member User:  member@example.com / password123');
        console.log('---------------------------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Failed to reset credentials:', error);
        process.exit(1);
    }
};

resetCredentials();
