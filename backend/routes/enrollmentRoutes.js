const express = require('express');
const router = express.Router();
const enrollController = require('../controllers/enrollController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Student routes
router.get('/my', enrollController.getMyEnrollments);
router.post('/', enrollController.createEnrollment);
router.put('/:id/progress', enrollController.updateProgress);
router.delete('/:id', enrollController.deleteEnrollment);

// Admin routes
router.get('/', requireRole('admin', 'instructor'), enrollController.getAllEnrollments);
router.get('/:id', enrollController.getEnrollmentById);
router.put('/:id', requireRole('admin'), enrollController.updateEnrollment);

module.exports = router;
