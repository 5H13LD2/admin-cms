const { getFirestore } = require('../../config/firebase-admin');
const logger = require('../../utils/logger');

const COLLECTION_NAME = 'enrollments';

const enrollmentService = {
  // Get all enrollments
  getAllEnrollments: async (filters = {}) => {
    try {
      const db = getFirestore();
      let query = db.collection(COLLECTION_NAME);

      if (filters.userId) {
        query = query.where('userId', '==', filters.userId);
      }

      if (filters.courseId) {
        query = query.where('courseId', '==', filters.courseId);
      }

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      const snapshot = await query.get();
      const enrollments = [];

      snapshot.forEach((doc) => {
        enrollments.push({ id: doc.id, ...doc.data() });
      });

      return enrollments;
    } catch (error) {
      logger.error('Error getting enrollments:', error);
      throw error;
    }
  },

  // Get enrollment by ID
  getEnrollmentById: async (enrollmentId) => {
    try {
      const db = getFirestore();
      const doc = await db.collection(COLLECTION_NAME).doc(enrollmentId).get();

      if (!doc.exists) {
        return null;
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('Error getting enrollment by ID:', error);
      throw error;
    }
  },

  // Create enrollment
  createEnrollment: async (enrollmentData) => {
    try {
      const db = getFirestore();

      // Check if enrollment already exists
      const existingSnapshot = await db.collection(COLLECTION_NAME)
        .where('userId', '==', enrollmentData.userId)
        .where('courseId', '==', enrollmentData.courseId)
        .limit(1)
        .get();

      if (!existingSnapshot.empty) {
        throw new Error('User is already enrolled in this course');
      }

      const newEnrollment = {
        ...enrollmentData,
        status: enrollmentData.status || 'active',
        progress: 0,
        enrolledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await db.collection(COLLECTION_NAME).add(newEnrollment);

      // Update course enrollment count
      const courseRef = db.collection('courses').doc(enrollmentData.courseId);
      await courseRef.update({
        enrollmentCount: db.FieldValue.increment(1),
      });

      return { id: docRef.id, ...newEnrollment };
    } catch (error) {
      logger.error('Error creating enrollment:', error);
      throw error;
    }
  },

  // Update enrollment
  updateEnrollment: async (enrollmentId, updates) => {
    try {
      const db = getFirestore();
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await db.collection(COLLECTION_NAME).doc(enrollmentId).update(updateData);
      return await enrollmentService.getEnrollmentById(enrollmentId);
    } catch (error) {
      logger.error('Error updating enrollment:', error);
      throw error;
    }
  },

  // Delete enrollment
  deleteEnrollment: async (enrollmentId) => {
    try {
      const db = getFirestore();
      const enrollment = await enrollmentService.getEnrollmentById(enrollmentId);

      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      await db.collection(COLLECTION_NAME).doc(enrollmentId).delete();

      // Update course enrollment count
      const courseRef = db.collection('courses').doc(enrollment.courseId);
      await courseRef.update({
        enrollmentCount: db.FieldValue.increment(-1),
      });

      return true;
    } catch (error) {
      logger.error('Error deleting enrollment:', error);
      throw error;
    }
  },

  // Update enrollment progress
  updateProgress: async (enrollmentId, progress) => {
    try {
      const db = getFirestore();
      await db.collection(COLLECTION_NAME).doc(enrollmentId).update({
        progress,
        updatedAt: new Date().toISOString(),
      });

      return await enrollmentService.getEnrollmentById(enrollmentId);
    } catch (error) {
      logger.error('Error updating progress:', error);
      throw error;
    }
  },
};

module.exports = enrollmentService;
