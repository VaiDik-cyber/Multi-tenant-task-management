const db = require('../config/db');

exports.getAnalytics = async (req, res) => {
    const { organizationId } = req.user;

    try {
        const [
            tasksCompletedPerUser,
            overdueTasksCount,
            avgCompletionTime
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
                `SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, completed_at)) as avg_completion_hours
                 FROM tasks 
                 WHERE organization_id = ? AND status = 'done' AND deleted_at IS NULL`,
                [organizationId]
            )
        ]);

        res.json({
            tasksCompletedPerUser: tasksCompletedPerUser[0],
            overdueTasksCount: overdueTasksCount[0][0].overdue_count,
            avgCompletionTime: avgCompletionTime[0][0].avg_completion_hours || 0
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};
