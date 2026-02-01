const db = require('../config/db');

exports.create = async (req, res) => {
    const { name, description } = req.body;
    const { organizationId } = req.user;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO projects (organization_id, name, description) VALUES (?, ?, ?)',
            [organizationId, name, description]
        );
        res.status(201).json({ id: result.insertId, name, description, status: 'active' });
    } catch (error) {
        console.error('Create Project Error:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
};

exports.list = async (req, res) => {
    const { organizationId } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const [projects] = await db.query(
            'SELECT * FROM projects WHERE organization_id = ? AND deleted_at IS NULL LIMIT ? OFFSET ?',
            [organizationId, limit, offset]
        );
        res.json(projects);
    } catch (error) {
        console.error('List Projects Error:', error);
        res.status(500).json({ error: 'Failed to list projects' });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    const { organizationId } = req.user;

    try {
        const [result] = await db.query(
            'UPDATE projects SET deleted_at = NOW() WHERE id = ? AND organization_id = ?',
            [id, organizationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found or access denied' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete Project Error:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
};
