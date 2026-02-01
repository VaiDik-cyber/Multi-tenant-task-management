const db = require('./config/db');

async function testAnalytics() {
    console.log("Testing Analytics Queries...");
    const organizationId = 1; // Assuming org 1 exists

    try {
        console.log("1. Tasks Completed Per User");
        await db.query(
            `SELECT u.username, COUNT(t.id) as completed_count 
             FROM users u 
             LEFT JOIN tasks t ON u.id = t.assignee_id AND t.organization_id = ? AND t.status = 'done' AND t.deleted_at IS NULL
             WHERE u.organization_id = ?
             GROUP BY u.id`,
            [organizationId, organizationId]
        );

        console.log("2. Overdue Tasks");
        await db.query(
            `SELECT COUNT(*) as overdue_count 
             FROM tasks 
             WHERE organization_id = ? AND due_date < NOW() AND status != 'done' AND deleted_at IS NULL`,
            [organizationId]
        );

        console.log("3. Avg Completion Time");
        await db.query(
            `SELECT AVG(TIMESTAMPDIFF(MINUTE, created_at, completed_at)) / 60.0 as avg_completion_hours
             FROM tasks 
             WHERE organization_id = ? AND status = 'done' AND deleted_at IS NULL`,
            [organizationId]
        );

        console.log("4. Total Tasks");
        await db.query(
            `SELECT COUNT(*) as total_count FROM tasks WHERE organization_id = ? AND deleted_at IS NULL`,
            [organizationId]
        );

        console.log("5. Total Completed Tasks");
        await db.query(
            `SELECT COUNT(*) as total_completed_count FROM tasks WHERE organization_id = ? AND status = 'done' AND deleted_at IS NULL`,
            [organizationId]
        );

        console.log("6. Tasks By Status");
        const [rows] = await db.query(
            `SELECT status, COUNT(*) as count FROM tasks WHERE organization_id = ? AND deleted_at IS NULL GROUP BY status`,
            [organizationId]
        );
        console.log("Tasks By Status Result:", rows);

        console.log("✅ All queries successful!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Query Failed:", error);
        process.exit(1);
    }
}

testAnalytics();
