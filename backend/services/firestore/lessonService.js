const { getFirestore } = require('../../config/firebase-admin');
const logger = require('../../utils/logger');

const COLLECTION_NAME = 'lessons';

const lessonService = {
  // Get all lessons for a module
  getLessonsByModule: async (moduleId) => {
    try {
      const db = getFirestore();
      const snapshot = await db.collection(COLLECTION_NAME)
        .where('moduleId', '==', moduleId)
        .orderBy('order', 'asc')
        .get();

      const lessons = [];
      snapshot.forEach((doc) => {
        lessons.push({ id: doc.id, ...doc.data() });
      });

      return lessons;
    } catch (error) {
      logger.error('Error getting lessons by module:', error);
      throw error;
    }
  },

  // Get lesson by ID
  getLessonById: async (lessonId) => {
    try {
      const db = getFirestore();
      const doc = await db.collection(COLLECTION_NAME).doc(lessonId).get();

      if (!doc.exists) {
        return null;
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('Error getting lesson by ID:', error);
      throw error;
    }
  },

  // Create lesson
  createLesson: async (lessonData) => {
    try {
      const db = getFirestore();
      const newLesson = {
        ...lessonData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await db.collection(COLLECTION_NAME).add(newLesson);
      return { id: docRef.id, ...newLesson };
    } catch (error) {
      logger.error('Error creating lesson:', error);
      throw error;
    }
  },

  // Update lesson
  updateLesson: async (lessonId, updates) => {
    try {
      const db = getFirestore();
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await db.collection(COLLECTION_NAME).doc(lessonId).update(updateData);
      return await lessonService.getLessonById(lessonId);
    } catch (error) {
      logger.error('Error updating lesson:', error);
      throw error;
    }
  },

  // Delete lesson
  deleteLesson: async (lessonId) => {
    try {
      const db = getFirestore();
      await db.collection(COLLECTION_NAME).doc(lessonId).delete();
      return true;
    } catch (error) {
      logger.error('Error deleting lesson:', error);
      throw error;
    }
  },
};

module.exports = lessonService;
