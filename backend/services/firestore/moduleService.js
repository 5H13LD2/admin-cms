const { getFirestore } = require('../../config/firebase-admin');
const logger = require('../../utils/logger');

const COLLECTION_NAME = 'modules';

const moduleService = {
  // Get all modules for a course
  getModulesByCourse: async (courseId) => {
    try {
      const db = getFirestore();
      const snapshot = await db.collection(COLLECTION_NAME)
        .where('courseId', '==', courseId)
        .orderBy('order', 'asc')
        .get();

      const modules = [];
      snapshot.forEach((doc) => {
        modules.push({ id: doc.id, ...doc.data() });
      });

      return modules;
    } catch (error) {
      logger.error('Error getting modules by course:', error);
      throw error;
    }
  },

  // Get module by ID
  getModuleById: async (moduleId) => {
    try {
      const db = getFirestore();
      const doc = await db.collection(COLLECTION_NAME).doc(moduleId).get();

      if (!doc.exists) {
        return null;
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('Error getting module by ID:', error);
      throw error;
    }
  },

  // Create module
  createModule: async (moduleData) => {
    try {
      const db = getFirestore();
      const newModule = {
        ...moduleData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await db.collection(COLLECTION_NAME).add(newModule);
      return { id: docRef.id, ...newModule };
    } catch (error) {
      logger.error('Error creating module:', error);
      throw error;
    }
  },

  // Update module
  updateModule: async (moduleId, updates) => {
    try {
      const db = getFirestore();
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await db.collection(COLLECTION_NAME).doc(moduleId).update(updateData);
      return await moduleService.getModuleById(moduleId);
    } catch (error) {
      logger.error('Error updating module:', error);
      throw error;
    }
  },

  // Delete module
  deleteModule: async (moduleId) => {
    try {
      const db = getFirestore();
      await db.collection(COLLECTION_NAME).doc(moduleId).delete();
      return true;
    } catch (error) {
      logger.error('Error deleting module:', error);
      throw error;
    }
  },
};

module.exports = moduleService;
