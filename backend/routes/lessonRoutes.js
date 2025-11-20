const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get lessons by module
router.get('/module/:moduleId', lessonController.getLessonsByModule);
router.get('/:id', lessonController.getLessonById);

// Instructor/Admin only
router.post('/', requireRole('instructor', 'admin'), lessonController.createLesson);
router.put('/:id', requireRole('instructor', 'admin'), lessonController.updateLesson);
router.delete('/:id', requireRole('instructor', 'admin'), lessonController.deleteLesson);

module.exports = router;
