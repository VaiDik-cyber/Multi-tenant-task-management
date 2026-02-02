const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Authenticated Routes
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

router.use('/users', authMiddleware);
router.post('/users', requireRole('admin'), authController.createUser);
router.get('/users', authController.listUsers); // Allow all members to list users (for assignment)

module.exports = router;
