const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

router.use(authMiddleware); // Protect all routes

router.post('/', requireRole('admin'), projectController.create);
router.get('/', projectController.list); // Allow listing for members
router.delete('/:id', requireRole('admin'), projectController.delete);

module.exports = router;
