const express = require('express');
const router = express.Router();
// const quizController = require('../controllers/quizController');
// const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// All routes require authentication
// router.use(authMiddleware);

// Student routes
// router.get('/lesson/:lessonId', quizController.getQuizzesByLesson);
// router.get('/:id', quizController.getQuizById);
// router.post('/:id/submit', quizController.submitQuizAnswer);
// router.get('/submissions/my', quizController.getMySubmissions);

// Instructor/Admin only
// router.post('/', requireRole('instructor', 'admin'), quizController.createQuiz);
// router.put('/:id', requireRole('instructor', 'admin'), quizController.updateQuiz);
// router.delete('/:id', requireRole('instructor', 'admin'), quizController.deleteQuiz);

module.exports = router;
