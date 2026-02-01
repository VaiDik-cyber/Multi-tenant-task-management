const db = require('../config/db');

exports.getAnalytics = async (req, res) => {
    const { organizationId } = req.user;
    console.log('Fetching analytics for org:', organizationId);

    try {
        const [
            tasksCompletedPerUser,
            overdueTasksCount,
            avgCompletionTime,
            totalTasksCount,
            totalCompletedCount,
            tasksByStatus
        ] = await Promise.all([
            // 1. Tasks Completed Per User
            db.query(
                `SELECT u.username, COUNT(t.id) as completed_count 
                 FROM users u 
                 LEFT JOIN tasks t ON u.id = t.assignee_id AND t.organization_id = ? AND t.status = 'done' AND t.deleted_at IS NULL
                 WHERE u.organization_id = ?
                 GROUP BY u.id`,
                [organizationId, organizationId]
            ),
            // 2. Overdue Tasks Count
            db.query(
                `SELECT COUNT(*) as overdue_count 
                 FROM tasks 
                 WHERE organization_id = ? AND due_date < NOW() AND status != 'done' AND deleted_at IS NULL`,
                [organizationId]
            ),
            // 3. Average Completion Time (in hours)
            db.query(
                `SELECT AVG(TIMESTAMPDIFF(MINUTE, created_at, completed_at)) / 60.0 as avg_completion_hours
                 FROM tasks 
                 WHERE organization_id = ? AND status = 'done' AND deleted_at IS NULL`,
                [organizationId]
            ),
            // 4. Total Tasks (All active tasks)
            db.query(
                `SELECT COUNT(*) as total_count FROM tasks WHERE organization_id = ? AND deleted_at IS NULL`,
                [organizationId]
            ),
            // 5. Total Completed Tasks
            db.query(
                `SELECT COUNT(*) as total_completed_count FROM tasks WHERE organization_id = ? AND status = 'done' AND deleted_at IS NULL`,
                [organizationId]
            ),
            // 6. Tasks by Status (For Chart)
            db.query(
                `SELECT status, COUNT(*) as count FROM tasks WHERE organization_id = ? AND deleted_at IS NULL GROUP BY status`,
                [organizationId]
            )
        ]);

        res.json({
            tasksCompletedPerUser: tasksCompletedPerUser[0],
            overdueTasksCount: overdueTasksCount[0][0].overdue_count,
            avgCompletionTime: avgCompletionTime[0][0].avg_completion_hours || 0,
            totalTasksCount: totalTasksCount[0][0].total_count,
            totalCompletedCount: totalCompletedCount[0][0].total_completed_count,
            tasksByStatus: tasksByStatus[0]
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};
