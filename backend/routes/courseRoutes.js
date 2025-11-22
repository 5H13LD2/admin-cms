const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const quizController = require('../controllers/quizController');

// Public routes (can view courses)
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.get('/:id/modules', courseController.getCourseModules);

// Quiz routes for courses
router.get('/:courseId/quizzes', quizController.getQuizzes);
router.post('/:courseId/quizzes', quizController.addQuiz);
router.put('/:courseId/quizzes/:questionId', quizController.updateQuiz);
router.delete('/:courseId/quizzes/:questionId', quizController.deleteQuiz);
router.get('/:courseId/quizzes/stats', quizController.getQuizStats);

// Instructor routes (no auth required for now - can be added later)
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
