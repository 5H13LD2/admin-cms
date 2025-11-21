const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// Disable authentication temporarily for testing
// router.use(authMiddleware);

// User management
router.get('/', userController.getAllUsers);
router.get('/search', userController.searchUser);
router.get('/:userId/dashboard', userController.getUserDashboard);
router.get('/:userId/statistics', userController.getUserStatistics);

module.exports = router;
