const db = require('./config/db');

const inspectUsers = async () => {
    try {
        const [users] = await db.query('SELECT id, organization_id, username, email, role, password_hash FROM users');
        console.log('Current Users in DB:');
        console.table(users);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

inspectUsers();
