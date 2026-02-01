const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protect all routes

router.post('/', projectController.create);
router.get('/', projectController.list);
router.delete('/:id', projectController.delete);

module.exports = router;
