const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole'); // Assuming requireRole is exported from authMiddleware

router.use(authMiddleware);

router.get('/', analyticsController.getAnalytics);

module.exports = router;
