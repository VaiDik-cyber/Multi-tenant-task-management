const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protect all routes

router.post('/', taskController.create);
router.get('/', taskController.list);
router.delete('/:id', taskController.delete);

module.exports = router;
