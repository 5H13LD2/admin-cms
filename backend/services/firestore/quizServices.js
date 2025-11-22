const { getFirestore } = require('../../config/firebase-admin');
const logger = require('../../utils/logger');

// Firebase structure: course_quiz/{courseId}/questions/{questionId}
const COURSE_QUIZ_COLLECTION = 'course_quiz';
const QUESTIONS_SUBCOLLECTION = 'questions';

const quizServices = {
  /**
   * Get all quizzes for a course (with optional module filter)
   * @param {string} courseId - The course ID
   * @param {string} moduleId - Optional module ID to filter by
   * @returns {Promise<Array>} Array of quiz questions
   */
  getQuizzes: async (courseId, moduleId = null) => {
    try {
      const db = getFirestore();

      // Get questions from: course_quiz/{courseId}/questions
      const questionsRef = db
        .collection(COURSE_QUIZ_COLLECTION)
        .doc(courseId)
        .collection(QUESTIONS_SUBCOLLECTION);

      let query = questionsRef;

      // Apply module filter if provided
      if (moduleId && moduleId !== 'all') {
        query = query.where('module_id', '==', moduleId);
      }

      const snapshot = await query.get();

      const quizzes = [];
      snapshot.forEach((doc) => {
        quizzes.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      logger.info(`Retrieved ${quizzes.length} quizzes for course ${courseId}${moduleId ? ` and module ${moduleId}` : ''}`);
      return quizzes;
    } catch (error) {
      logger.error('Error getting quizzes:', error);
      throw error;
    }
  },

  /**
   * Add a new quiz question
   * @param {string} courseId - The course ID
   * @param {Object} quizData - The quiz question data
   * @returns {Promise<Object>} The created quiz with ID
   */
  addQuiz: async (courseId, quizData) => {
    try {
      const db = getFirestore();

      const newQuiz = {
        ...quizData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const questionsRef = db
        .collection(COURSE_QUIZ_COLLECTION)
        .doc(courseId)
        .collection(QUESTIONS_SUBCOLLECTION);

      const docRef = await questionsRef.add(newQuiz);

      logger.info(`Created quiz ${docRef.id} for course ${courseId}`);

      return {
        id: docRef.id,
        ...newQuiz,
      };
    } catch (error) {
      logger.error('Error adding quiz:', error);
      throw error;
    }
  },

  /**
   * Update a quiz question
   * @param {string} courseId - The course ID
   * @param {string} questionId - The question ID
   * @param {Object} updatedData - The updated data
   * @returns {Promise<Object>} The updated quiz
   */
  updateQuiz: async (courseId, questionId, updatedData) => {
    try {
      const db = getFirestore();

      const updateData = {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };

      const questionRef = db
        .collection(COURSE_QUIZ_COLLECTION)
        .doc(courseId)
        .collection(QUESTIONS_SUBCOLLECTION)
        .doc(questionId);

      const doc = await questionRef.get();

      if (!doc.exists) {
        throw new Error('Quiz question not found');
      }

      await questionRef.update(updateData);

      const updatedDoc = await questionRef.get();

      logger.info(`Updated quiz ${questionId} for course ${courseId}`);

      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      };
    } catch (error) {
      logger.error('Error updating quiz:', error);
      throw error;
    }
  },

  /**
   * Delete a quiz question
   * @param {string} courseId - The course ID
   * @param {string} questionId - The question ID
   * @returns {Promise<Object>} Success message
   */
  deleteQuiz: async (courseId, questionId) => {
    try {
      const db = getFirestore();

      const questionRef = db
        .collection(COURSE_QUIZ_COLLECTION)
        .doc(courseId)
        .collection(QUESTIONS_SUBCOLLECTION)
        .doc(questionId);

      const doc = await questionRef.get();

      if (!doc.exists) {
        throw new Error('Quiz question not found');
      }

      await questionRef.delete();

      logger.info(`Deleted quiz ${questionId} from course ${courseId}`);

      return {
        message: 'Quiz question deleted successfully',
      };
    } catch (error) {
      logger.error('Error deleting quiz:', error);
      throw error;
    }
  },

  /**
   * Get quiz statistics for a course
   * @param {string} courseId - The course ID
   * @returns {Promise<Object>} Quiz statistics
   */
  getQuizStats: async (courseId) => {
    try {
      const db = getFirestore();

      const questionsRef = db
        .collection(COURSE_QUIZ_COLLECTION)
        .doc(courseId)
        .collection(QUESTIONS_SUBCOLLECTION);

      const snapshot = await questionsRef.get();

      const stats = {
        total: 0,
        easy: 0,
        normal: 0,
        hard: 0,
        byModule: {},
      };

      snapshot.forEach((doc) => {
        const quiz = doc.data();
        stats.total++;

        // Count by difficulty
        const difficulty = (quiz.difficulty || 'NORMAL').toUpperCase();
        if (difficulty === 'EASY') stats.easy++;
        else if (difficulty === 'HARD') stats.hard++;
        else stats.normal++;

        // Count by module
        const moduleId = quiz.module_id || 'unknown';
        stats.byModule[moduleId] = (stats.byModule[moduleId] || 0) + 1;
      });

      logger.info(`Retrieved quiz stats for course ${courseId}: ${stats.total} total`);

      return stats;
    } catch (error) {
      logger.error('Error getting quiz stats:', error);
      throw error;
    }
  },
};

module.exports = quizServices;
