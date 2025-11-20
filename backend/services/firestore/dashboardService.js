const { getFirestore } = require('../../config/firebase-admin');
const logger = require('../../utils/logger');

const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async (userId, role) => {
    try {
      const db = getFirestore();
      const stats = {};

      if (role === 'admin') {
        // Admin dashboard stats
        const usersSnapshot = await db.collection('users').get();
        const coursesSnapshot = await db.collection('courses').get();
        const enrollmentsSnapshot = await db.collection('enrollments').get();

        stats.totalUsers = usersSnapshot.size;
        stats.totalCourses = coursesSnapshot.size;
        stats.totalEnrollments = enrollmentsSnapshot.size;

        // Active enrollments
        const activeEnrollments = enrollmentsSnapshot.docs.filter(
          (doc) => doc.data().status === 'active'
        );
        stats.activeEnrollments = activeEnrollments.length;

      } else if (role === 'instructor') {
        // Instructor dashboard stats
        const coursesSnapshot = await db.collection('courses')
          .where('instructorId', '==', userId)
          .get();

        stats.totalCourses = coursesSnapshot.size;

        let totalEnrollments = 0;
        for (const courseDoc of coursesSnapshot.docs) {
          const enrollmentsSnapshot = await db.collection('enrollments')
            .where('courseId', '==', courseDoc.id)
            .get();
          totalEnrollments += enrollmentsSnapshot.size;
        }

        stats.totalEnrollments = totalEnrollments;

      } else if (role === 'student') {
        // Student dashboard stats
        const enrollmentsSnapshot = await db.collection('enrollments')
          .where('userId', '==', userId)
          .get();

        stats.enrolledCourses = enrollmentsSnapshot.size;

        const activeEnrollments = enrollmentsSnapshot.docs.filter(
          (doc) => doc.data().status === 'active'
        );
        stats.activeCourses = activeEnrollments.length;

        const completedEnrollments = enrollmentsSnapshot.docs.filter(
          (doc) => doc.data().status === 'completed'
        );
        stats.completedCourses = completedEnrollments.length;

        // Calculate average progress
        const totalProgress = enrollmentsSnapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().progress || 0),
          0
        );
        stats.averageProgress = enrollmentsSnapshot.size > 0
          ? Math.round(totalProgress / enrollmentsSnapshot.size)
          : 0;
      }

      return stats;
    } catch (error) {
      logger.error('Error getting dashboard stats:', error);
      throw error;
    }
  },

  // Get recent activities
  getRecentActivities: async (userId, role, limit = 10) => {
    try {
      const db = getFirestore();
      const activities = [];

      if (role === 'student') {
        // Get recent enrollments and quiz submissions
        const enrollmentsSnapshot = await db.collection('enrollments')
          .where('userId', '==', userId)
          .orderBy('updatedAt', 'desc')
          .limit(limit)
          .get();

        enrollmentsSnapshot.forEach((doc) => {
          activities.push({
            type: 'enrollment',
            ...doc.data(),
            id: doc.id,
          });
        });
      } else if (role === 'instructor') {
        // Get recent course updates
        const coursesSnapshot = await db.collection('courses')
          .where('instructorId', '==', userId)
          .orderBy('updatedAt', 'desc')
          .limit(limit)
          .get();

        coursesSnapshot.forEach((doc) => {
          activities.push({
            type: 'course',
            ...doc.data(),
            id: doc.id,
          });
        });
      }

      return activities;
    } catch (error) {
      logger.error('Error getting recent activities:', error);
      throw error;
    }
  },
};

module.exports = dashboardService;
