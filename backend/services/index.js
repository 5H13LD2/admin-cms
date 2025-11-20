const userService = require('./firestore/userService');
const courseService = require('./firestore/courseService');
const moduleService = require('./firestore/moduleService');
const lessonService = require('./firestore/lessonService');
const quizService = require('./firestore/quizService');
const enrollmentService = require('./firestore/enrollmentService');
const dashboardService = require('./firestore/dashboardService');

module.exports = {
  userService,
  courseService,
  moduleService,
  lessonService,
  quizService,
  enrollmentService,
  dashboardService,
};
