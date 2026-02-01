const db = require('./config/db');
const bcrypt = require('bcryptjs');

const fixCredentials = async () => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const connection = await db.getConnection();

        console.log('Fixing credentials...');

        // 1. Fix Admin (Update ID 1)
        // We force ID 1 to be exactly what we promised
        await connection.query(`
            UPDATE users 
            SET username = 'admin', email = 'admin@example.com', password_hash = ? 
            WHERE id = 1
        `, [hashedPassword]);

        // 2. Fix Member 
        // We verified member is ID 4, but let's be safe. 
        // We'll upsert ID 4 to be member@example.com
        await connection.query(`
             INSERT INTO users (id, organization_id, username, email, password_hash, role)
             VALUES (4, 1, 'member', 'member@example.com', ?, 'user')
             ON DUPLICATE KEY UPDATE 
                username = 'member',
                email = 'member@example.com',
                password_hash = ?,
                role = 'user'
        `, [hashedPassword, hashedPassword]);

        console.log('\n✅ Credentials Fixed!');
        process.exit(0);
    } catch (error) {
        console.error('Failed to fix credentials:', error);
        process.exit(1);
    }
};

fixCredentials();
