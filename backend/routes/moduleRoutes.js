const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
// const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// All routes require authentication
// router.use(authMiddleware);

// Get modules by course
// router.get('/course/:courseId', moduleController.getModulesByCourse);
// router.get('/:id', moduleController.getModuleById);

// Instructor/Admin only
// router.post('/', requireRole('instructor', 'admin'), moduleController.createModule);
// router.put('/:id', requireRole('instructor', 'admin'), moduleController.updateModule);
// router.delete('/:id', requireRole('instructor', 'admin'), moduleController.deleteModule);

module.exports = router;
