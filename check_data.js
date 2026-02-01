const db = require('./config/db');

async function check() {
    try {
        const [users] = await db.query('SELECT id, username, email, organization_id, role FROM users');
        console.log('--- USERS ---');
        console.table(users);

        const [tasks] = await db.query('SELECT id, title, status, organization_id, assignee_id, deleted_at, created_at, completed_at FROM tasks');
        console.log('--- TASKS ---');
        console.table(tasks);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
