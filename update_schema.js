const db = require('./config/db');

async function migrate() {
    try {
        console.log('Adding columns to tasks table...');

        try {
            await db.query('ALTER TABLE tasks ADD COLUMN due_date DATETIME');
            console.log('Added due_date column');
        } catch (e) {
            console.log('due_date column might already exist:', e.message);
        }

        try {
            await db.query('ALTER TABLE tasks ADD COLUMN completed_at DATETIME');
            console.log('Added completed_at column');
        } catch (e) {
            console.log('completed_at column might already exist:', e.message);
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
