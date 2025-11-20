const { getFirestore } = require('../../config/firebase-admin');
const logger = require('../../utils/logger');

const COLLECTION_NAME = 'quizzes';

const quizService = {
  // Get all quizzes for a lesson
  getQuizzesByLesson: async (lessonId) => {
    try {
      const db = getFirestore();
      const snapshot = await db.collection(COLLECTION_NAME)
        .where('lessonId', '==', lessonId)
        .get();

      const quizzes = [];
      snapshot.forEach((doc) => {
        quizzes.push({ id: doc.id, ...doc.data() });
      });

      return quizzes;
    } catch (error) {
      logger.error('Error getting quizzes by lesson:', error);
      throw error;
    }
  },

  // Get quiz by ID
  getQuizById: async (quizId) => {
    try {
      const db = getFirestore();
      const doc = await db.collection(COLLECTION_NAME).doc(quizId).get();

      if (!doc.exists) {
        return null;
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('Error getting quiz by ID:', error);
      throw error;
    }
  },

  // Create quiz
  createQuiz: async (quizData) => {
    try {
      const db = getFirestore();
      const newQuiz = {
        ...quizData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await db.collection(COLLECTION_NAME).add(newQuiz);
      return { id: docRef.id, ...newQuiz };
    } catch (error) {
      logger.error('Error creating quiz:', error);
      throw error;
    }
  },

  // Update quiz
  updateQuiz: async (quizId, updates) => {
    try {
      const db = getFirestore();
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await db.collection(COLLECTION_NAME).doc(quizId).update(updateData);
      return await quizService.getQuizById(quizId);
    } catch (error) {
      logger.error('Error updating quiz:', error);
      throw error;
    }
  },

  // Delete quiz
  deleteQuiz: async (quizId) => {
    try {
      const db = getFirestore();
      await db.collection(COLLECTION_NAME).doc(quizId).delete();
      return true;
    } catch (error) {
      logger.error('Error deleting quiz:', error);
      throw error;
    }
  },

  // Submit quiz answer
  submitQuizAnswer: async (quizId, userId, answers) => {
    try {
      const db = getFirestore();
      const submission = {
        quizId,
        userId,
        answers,
        submittedAt: new Date().toISOString(),
      };

      const docRef = await db.collection('quiz_submissions').add(submission);
      return { id: docRef.id, ...submission };
    } catch (error) {
      logger.error('Error submitting quiz answer:', error);
      throw error;
    }
  },

  // Get quiz submissions by user
  getQuizSubmissionsByUser: async (userId, quizId) => {
    try {
      const db = getFirestore();
      let query = db.collection('quiz_submissions').where('userId', '==', userId);

      if (quizId) {
        query = query.where('quizId', '==', quizId);
      }

      const snapshot = await query.get();
      const submissions = [];

      snapshot.forEach((doc) => {
        submissions.push({ id: doc.id, ...doc.data() });
      });

      return submissions;
    } catch (error) {
      logger.error('Error getting quiz submissions:', error);
      throw error;
    }
  },
};

module.exports = quizService;
