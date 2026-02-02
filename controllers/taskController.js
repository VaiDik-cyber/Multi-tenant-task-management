const db = require('../config/db');

exports.create = async (req, res) => {
    const { projectId, title, description, priority, assigneeId } = req.body;
    const { organizationId } = req.user;

    if (!projectId || !title) {
        return res.status(400).json({ error: 'Project ID and Title are required' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Verify project belongs to organization
        const [project] = await connection.query(
            'SELECT id FROM projects WHERE id = ? AND organization_id = ? AND deleted_at IS NULL',
            [projectId, organizationId]
        );

        if (project.length === 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Invalid Project ID' });
        }

        const [result] = await connection.query(
            'INSERT INTO tasks (organization_id, project_id, title, description, priority, assignee_id, created_by, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [organizationId, projectId, title, description, priority || 'medium', assigneeId || null, req.user.userId, req.body.dueDate || null]
        );

        const newTaskId = result.insertId;

        // Log Activity
        await connection.query(
            'INSERT INTO activity_logs (organization_id, user_id, entity_type, entity_id, action, details) VALUES (?, ?, ?, ?, ?, ?)',
            [organizationId, req.user.userId, 'task', newTaskId, 'created', JSON.stringify({ title, projectId })]
        );

        await connection.commit();

        res.status(201).json({
            id: newTaskId,
            projectId,
            title,
            description,
            priority: priority || 'medium',
            status: 'todo',
            version: 1
        });
    } catch (error) {
        await connection.rollback();
        console.error('Create Task Error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    } finally {
        connection.release();
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

    // RBAC: Only admins can delete tasks
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Only admins can delete tasks.' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'UPDATE tasks SET deleted_at = NOW() WHERE id = ? AND organization_id = ?',
            [id, organizationId]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Task not found or access denied' });
        }

        // Log Activity
        await connection.query(
            'INSERT INTO activity_logs (organization_id, user_id, entity_type, entity_id, action, details) VALUES (?, ?, ?, ?, ?, ?)',
            [organizationId, req.user.userId, 'task', id, 'deleted', JSON.stringify({ deletedAt: new Date() })]
        );

        await connection.commit();

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Delete Task Error:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    } finally {
        connection.release();
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
        let query = 'UPDATE tasks SET status = ?, version = version + 1';
        const params = [status];

        if (status === 'done') {
            query += ', completed_at = NOW()';
        } else {
            query += ', completed_at = NULL';
        }

        query += ' WHERE id = ? AND organization_id = ? AND version = ?';
        params.push(id, organizationId, version);

        // RBAC: Members can only update tasks if they are Assignee OR Creator
        if (req.user.role !== 'admin') {
            query += ' AND (assignee_id = ? OR created_by = ?)';
            params.push(userId, userId);
        }

        const [result] = await connection.query(query, params);

        if (result.affectedRows === 0) {
            await connection.rollback();
            // Check if task exists to distinguish between 404 (not found), 403 (access denied), and 409 (conflict)
            const [task] = await connection.query(
                'SELECT version, assignee_id, created_by FROM tasks WHERE id = ? AND organization_id = ?',
                [id, organizationId]
            );

            if (task.length === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }

            // If user is not admin, not assignee, and not creator
            if (req.user.role !== 'admin' && task[0].assignee_id !== userId && task[0].created_by !== userId) {
                return res.status(403).json({ error: 'Access denied. You can only update tasks assigned to you or created by you.' });
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

exports.update = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, assigneeId, dueDate } = req.body;
    const { organizationId } = req.user;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Check if task exists and belongs to organization
        const [existing] = await connection.query(
            'SELECT id FROM tasks WHERE id = ? AND organization_id = ? AND deleted_at IS NULL',
            [id, organizationId]
        );

        if (existing.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Task not found' });
        }

        // Update Task
        await connection.query(
            'UPDATE tasks SET title = ?, description = ?, priority = ?, assignee_id = ?, due_date = ? WHERE id = ?',
            [title, description, priority, assigneeId, dueDate || null, id]
        );

        // Log Activity
        await connection.query(
            'INSERT INTO activity_logs (organization_id, user_id, entity_type, entity_id, action, details) VALUES (?, ?, ?, ?, ?, ?)',
            [organizationId, req.user.userId, 'task', id, 'updated', JSON.stringify({ title, priority, assigneeId, dueDate })]
        );

        await connection.commit();

        res.json({
            id,
            title,
            description,
            priority,
            assigneeId,
            dueDate
        });

    } catch (error) {
        await connection.rollback();
        console.error('Update Task Error:', error);
        res.status(500).json({ error: 'Failed to update task' });
    } finally {
        connection.release();
    }
};
