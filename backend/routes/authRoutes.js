const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);
router.get('/verify', authMiddleware, authController.verifyToken);

module.exports = router;
