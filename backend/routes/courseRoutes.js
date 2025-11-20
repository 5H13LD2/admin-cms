const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Public routes (can view courses)
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.get('/:id/modules', courseController.getCourseModules);

// Instructor routes (no auth required for now - can be added later)
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
