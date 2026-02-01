const db = require('../config/db');

exports.create = async (req, res) => {
    const { projectId, title, description, priority, assigneeId } = req.body;
    const { organizationId } = req.user;

    if (!projectId || !title) {
        return res.status(400).json({ error: 'Project ID and Title are required' });
    }

    try {
        // Verify project belongs to organization
        const [project] = await db.query(
            'SELECT id FROM projects WHERE id = ? AND organization_id = ? AND deleted_at IS NULL',
            [projectId, organizationId]
        );

        if (project.length === 0) {
            return res.status(400).json({ error: 'Invalid Project ID' });
        }

        const [result] = await db.query(
            'INSERT INTO tasks (organization_id, project_id, title, description, priority, assignee_id) VALUES (?, ?, ?, ?, ?, ?)',
            [organizationId, projectId, title, description, priority || 'medium', assigneeId || null]
        );

        res.status(201).json({
            id: result.insertId,
            projectId,
            title,
            description,
            priority: priority || 'medium',
            status: 'todo',
            version: 1
        });
    } catch (error) {
        console.error('Create Task Error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

exports.list = async (req, res) => {
    const { organizationId } = req.user;
    const { projectId } = req.query; // Optional filter by project
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM tasks WHERE organization_id = ? AND deleted_at IS NULL';
    const params = [organizationId];

    if (projectId) {
        query += ' AND project_id = ?';
        params.push(projectId);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    try {
        const [tasks] = await db.query(query, params);
        res.json(tasks);
    } catch (error) {
        console.error('List Tasks Error:', error);
        res.status(500).json({ error: 'Failed to list tasks' });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    const { organizationId } = req.user;

    try {
        const [result] = await db.query(
            'UPDATE tasks SET deleted_at = NOW() WHERE id = ? AND organization_id = ?',
            [id, organizationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found or access denied' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete Task Error:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status, version } = req.body;
    const { organizationId, userId } = req.user;

    if (!status || version === undefined) {
        return res.status(400).json({ error: 'Status and version are required' });
    }

    const validStatuses = ['todo', 'in_progress', 'review', 'done'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Optimistic Locking Update
        const [result] = await connection.query(
            'UPDATE tasks SET status = ?, version = version + 1 WHERE id = ? AND organization_id = ? AND version = ?',
            [status, id, organizationId, version]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            // Check if task exists to distinguish between 404 (not found) and 409 (conflict)
            const [task] = await connection.query(
                'SELECT version FROM tasks WHERE id = ? AND organization_id = ?',
                [id, organizationId]
            );

            if (task.length === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }

            return res.status(409).json({ error: 'Task has been modified by another user. Please refresh and try again.' });
        }

        // Log Activity
        await connection.query(
            'INSERT INTO activity_logs (organization_id, user_id, entity_type, entity_id, action, details) VALUES (?, ?, ?, ?, ?, ?)',
            [organizationId, userId, 'task', id, 'status_updated', JSON.stringify({ oldVersion: version, newStatus: status })]
        );

        await connection.commit();

        res.json({
            message: 'Task status updated successfully',
            status,
            version: version + 1
        });

    } catch (error) {
        await connection.rollback();
        console.error('Update Task Status Error:', error);
        res.status(500).json({ error: 'Failed to update task status' });
    } finally {
        connection.release();
    }
};
