const { initializeFirebase, admin } = require('../../config/firebase-config');
const logger = require('../../utils/logger');

// Initialize Firebase and get db instance
const db = initializeFirebase();

class UserService {
  // Get all users with their course information
  static async getAllUsers() {
    try {
      const usersSnapshot = await db.collection('users').get();
      const users = [];
      
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        users.push({
          id: doc.id,
          userId: userData.userId || doc.id,
          username: userData.username || 'N/A',
          email: userData.email || 'N/A',
          coursesTaken: userData.coursesTaken || [],
          createdAt: userData.createdAt || null
        });
      });
      
      return users;
    } catch (error) {
      logger.error('❌ Failed to retrieve users:', { error: error.message });
      throw new Error('Failed to retrieve users from database');
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      const userSnapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (userSnapshot.empty) {
        return null;
      }
      
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      
      return {
        id: userDoc.id,
        userId: userData.userId || userDoc.id,
        username: userData.username || 'N/A',
        email: userData.email,
        coursesTaken: userData.coursesTaken || []
      };
    } catch (error) {
      logger.error('❌ Failed to find user by email:', { 
        email, 
        error: error.message 
      });
      throw new Error('Failed to find user');
    }
  }

  // Create new user
  static async createUser(userData) {
    try {
      const { userId, username, email } = userData;
      
      // Check if user already exists
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      const newUser = {
        userId,
        username,
        email,
        coursesTaken: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = await db.collection('users').add(newUser);
      
      return {
        id: docRef.id,
        ...newUser,
        createdAt: new Date()
      };
    } catch (error) {
      logger.error('❌ Failed to create user:', { 
        userData,
        error: error.message 
      });
      throw new Error(error.message || 'Failed to create user');
    }
  }

  // Enroll user in course using Firestore transaction
  static async enrollUserInCourse(userEmail, courseName) {
    try {
      const result = await db.runTransaction(async (transaction) => {
        // Get user by email
        const userQuery = await db.collection('users')
          .where('email', '==', userEmail)
          .limit(1)
          .get();
        
        if (userQuery.empty) {
          throw new Error('User not found');
        }
        
        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();
        
        // Get course by name
        const courseQuery = await db.collection('courses')
          .where('courseName', '==', courseName)
          .limit(1)
          .get();
        
        if (courseQuery.empty) {
          throw new Error('Course not found');
        }
        
        const courseDoc = courseQuery.docs[0];
        const courseData = courseDoc.data();
        
        // Check if user is already enrolled
        const userCourses = userData.coursesTaken || [];
        if (userCourses.includes(courseName)) {
          throw new Error('User is already enrolled in this course');
        }
        
        // Update user's courses
        const updatedUserCourses = [...userCourses, courseName];
        transaction.update(userDoc.ref, {
          coursesTaken: updatedUserCourses,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Update course's enrolled users
        const enrolledUsers = courseData.enrolledUsers || [];
        if (!enrolledUsers.includes(userEmail)) {
          const updatedEnrolledUsers = [...enrolledUsers, userEmail];
          transaction.update(courseDoc.ref, {
            enrolledUsers: updatedEnrolledUsers,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          });
        }
        
        return {
          userEmail,
          courseName,
          success: true,
          message: 'User successfully enrolled in course'
        };
      });
      
      return result;
    } catch (error) {
      logger.error('❌ Course enrollment failed:', { 
        userEmail, 
        courseName, 
        error: error.message 
      });
      throw new Error(error.message || 'Failed to enroll user in course');
    }
  }

  // Get recent activity (last 10 enrollments)
  static async getRecentActivity() {
    try {
      // This is a simplified version - in a real app, you'd store enrollment history
      const users = await this.getAllUsers();
      const recentActivity = [];

      // Generate some sample recent activity based on existing data
      users.slice(0, 5).forEach(user => {
        if (user.coursesTaken && user.coursesTaken.length > 0) {
          recentActivity.push({
            type: 'enrollment',
            message: `${user.username} enrolled in ${user.coursesTaken[user.coursesTaken.length - 1]}`,
            timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
          });
        }
      });

      const sortedActivity = recentActivity.sort((a, b) => b.timestamp - a.timestamp);
      return sortedActivity;
    } catch (error) {
      logger.error('❌ Failed to retrieve recent activity:', {
        error: error.message
      });
      throw new Error('Failed to retrieve recent activity');
    }
  }

  // ==================== Admin Methods ====================

  // Search user by username or UID
  static async searchUser(query) {
    try {
      logger.info(`🔍 Searching for user with query: ${query}`);

      // Try to find by document ID first (most direct)
      try {
        const userDocRef = db.collection('users').doc(query);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          logger.info(`✅ User found by document ID: ${userDoc.id}`);
          return {
            id: userDoc.id,
            userId: userData.userId || userDoc.id,
            username: userData.username || 'N/A',
            email: userData.email || 'N/A',
            coursesTaken: userData.coursesTaken || [],
            createdAt: userData.createdAt
          };
        }
      } catch (docError) {
        logger.debug(`Document ID lookup failed: ${docError.message}`);
      }

      // Try to find by userId field
      const userByIdSnapshot = await db.collection('users')
        .where('userId', '==', query)
        .limit(1)
        .get();

      if (!userByIdSnapshot.empty) {
        const userDoc = userByIdSnapshot.docs[0];
        const userData = userDoc.data();
        logger.info(`✅ User found by userId field: ${userDoc.id}`);
        return {
          id: userDoc.id,
          userId: userData.userId || userDoc.id,
          username: userData.username || 'N/A',
          email: userData.email || 'N/A',
          coursesTaken: userData.coursesTaken || [],
          createdAt: userData.createdAt
        };
      }

      // Try to find by username
      const userByUsernameSnapshot = await db.collection('users')
        .where('username', '==', query)
        .limit(1)
        .get();

      if (!userByUsernameSnapshot.empty) {
        const userDoc = userByUsernameSnapshot.docs[0];
        const userData = userDoc.data();
        logger.info(`✅ User found by username: ${userDoc.id}`);
        return {
          id: userDoc.id,
          userId: userData.userId || userDoc.id,
          username: userData.username || 'N/A',
          email: userData.email || 'N/A',
          coursesTaken: userData.coursesTaken || [],
          createdAt: userData.createdAt
        };
      }

      logger.warn(`⚠️ User not found for query: ${query}`);
      return null;
    } catch (error) {
      logger.error('❌ Failed to search user:', { query, error: error.message });
      throw new Error('Failed to search user');
    }
  }

  // Get comprehensive user dashboard data
  static async getUserDashboard(userId) {
    try {
      // Get user info
      const user = await this.searchUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get coding challenges
      const codingChallenges = await this.getCodingChallenges(userId);

      // Get quiz performance
      const quizPerformance = await this.getQuizPerformance(userId);

      // Calculate overall stats
      const totalActivities = codingChallenges.count + quizPerformance.count;
      const totalAttempts = codingChallenges.totalAttempts + quizPerformance.totalAttempts;

      const codingPassRate = codingChallenges.count > 0
        ? Math.round((codingChallenges.passedChallenges / codingChallenges.count) * 100)
        : 0;

      const overallPassRate = totalActivities > 0
        ? Math.round(((codingChallenges.passedChallenges + (quizPerformance.count * quizPerformance.passRate / 100)) / totalActivities) * 100)
        : 0;

      return {
        user,
        overallStats: {
          totalActivities,
          totalAttempts,
          codingChallenges: {
            total: codingChallenges.count,
            passed: codingChallenges.passedChallenges,
            passRate: codingPassRate
          },
          quizzes: {
            total: quizPerformance.count,
            passed: Math.round((quizPerformance.count * quizPerformance.passRate) / 100),
            passRate: quizPerformance.passRate
          },
          overallPassRate
        },
        codingChallenges,
        quizPerformance
      };
    } catch (error) {
      logger.error('❌ Failed to get user dashboard:', { userId, error: error.message });
      throw new Error('Failed to get user dashboard');
    }
  }

  // Get coding challenges for a user
  static async getCodingChallenges(userId) {
    try {
      logger.info(`🔍 Fetching coding challenges for user: ${userId}`);

      // Query: /user_progress/{userId}/technical_assessment_progress
      const progressRef = db.collection('user_progress')
        .doc(userId)
        .collection('technical_assessment_progress');

      const challengesSnapshot = await progressRef.get();

      logger.info(`📊 Found ${challengesSnapshot.size} technical assessment records`);

      const challengesMap = new Map();

      for (const doc of challengesSnapshot.docs) {
        const progress = doc.data();
        const assessmentId = doc.id;

        if (!challengesMap.has(assessmentId)) {
          challengesMap.set(assessmentId, {
            moduleId: assessmentId,
            challengeTitle: progress.assessmentName || progress.moduleName || assessmentId,
            bestScore: progress.score || progress.bestScore || 0,
            attempts: progress.attempts || 1,
            passed: progress.passed || progress.completed || false,
            lastAttemptDate: progress.lastAttemptAt || progress.completedAt || progress.timestamp,
            attemptsDetails: []
          });
        }

        const challenge = challengesMap.get(assessmentId);

        // Add attempt details if available
        if (progress.score !== undefined) {
          challenge.attemptsDetails.push({
            score: progress.score || 0,
            passed: progress.passed || false,
            timestamp: progress.lastAttemptAt || progress.timestamp,
            userCode: progress.userCode || progress.code,
            timeTaken: progress.timeTaken || progress.duration,
            formattedLastAttemptDate: this.formatTimestamp(progress.lastAttemptAt || progress.timestamp),
            formattedTimeTaken: progress.timeTaken ? `${Math.round(progress.timeTaken / 1000)}s` : 'N/A'
          });
        }
      }

      const challenges = Array.from(challengesMap.values()).map(challenge => ({
        ...challenge,
        statusText: challenge.passed ? 'Passed' : 'Failed',
        formattedLastAttemptDate: this.formatTimestamp(challenge.lastAttemptDate)
      }));

      const totalAttempts = challenges.reduce((sum, c) => sum + c.attempts, 0);
      const passedChallenges = challenges.filter(c => c.passed).length;

      logger.info(`✅ Processed ${challenges.length} challenges, ${passedChallenges} passed`);

      return {
        data: challenges,
        count: challenges.length,
        totalAttempts,
        passedChallenges,
        averageScore: challenges.length > 0
          ? Math.round(challenges.reduce((sum, c) => sum + c.bestScore, 0) / challenges.length)
          : 0
      };
    } catch (error) {
      logger.error('❌ Failed to get coding challenges:', { userId, error: error.message, stack: error.stack });
      // Return empty data instead of throwing to prevent dashboard from failing
      return {
        data: [],
        count: 0,
        totalAttempts: 0,
        passedChallenges: 0,
        averageScore: 0
      };
    }
  }

  // Get quiz performance for a user
  static async getQuizPerformance(userId) {
    try {
      logger.info(`🔍 Fetching quiz performance for user: ${userId}`);

      // Query: /users/{userId}/quiz_scores
      const quizScoresRef = db.collection('users')
        .doc(userId)
        .collection('quiz_scores');

      const quizScoresSnapshot = await quizScoresRef.get();

      logger.info(`📊 Found ${quizScoresSnapshot.size} quiz score records`);

      const quizzesMap = new Map();

      for (const quizDoc of quizScoresSnapshot.docs) {
        const quizId = quizDoc.id;
        const quizData = quizDoc.data();

        // Get attempts subcollection
        const attemptsSnapshot = await quizDoc.ref.collection('attempts').get();

        logger.info(`📝 Quiz ${quizId} has ${attemptsSnapshot.size} attempts`);

        const attempts = [];
        let firstAttempt = null;
        let lastAttempt = null;

        attemptsSnapshot.forEach(attemptDoc => {
          const attempt = attemptDoc.data();
          const timestamp = attempt.timestamp || attempt.attemptedAt || attempt.completedAt;

          attempts.push({
            score: attempt.score || 0,
            maxScore: attempt.maxScore || attempt.totalScore || 100,
            percentage: attempt.maxScore ? (attempt.score / attempt.maxScore) * 100 : (attempt.score || 0),
            passed: attempt.passed || attempt.score >= (attempt.passingScore || 60),
            timestamp: timestamp,
            difficulty: attempt.difficulty || 'N/A'
          });

          if (!firstAttempt || timestamp < firstAttempt) {
            firstAttempt = timestamp;
          }
          if (!lastAttempt || timestamp > lastAttempt) {
            lastAttempt = timestamp;
          }
        });

        if (attempts.length > 0) {
          quizzesMap.set(quizId, {
            quizId,
            courseName: quizData.courseName || quizData.moduleName || 'Unknown Course',
            attempts,
            firstAttempt,
            lastAttempt
          });
        }
      }

      const quizzes = Array.from(quizzesMap.values()).map(quiz => {
        const sortedAttempts = quiz.attempts.sort((a, b) => {
          const aTime = a.timestamp?._seconds || 0;
          const bTime = b.timestamp?._seconds || 0;
          return aTime - bTime;
        });

        const latest = sortedAttempts[sortedAttempts.length - 1];
        const highest = sortedAttempts.reduce((max, a) => a.percentage > max.percentage ? a : max);
        const averagePercentage = sortedAttempts.reduce((sum, a) => sum + a.percentage, 0) / sortedAttempts.length;

        // Calculate trend
        let trend = 'stable';
        if (sortedAttempts.length >= 2) {
          const firstHalf = sortedAttempts.slice(0, Math.ceil(sortedAttempts.length / 2));
          const secondHalf = sortedAttempts.slice(Math.ceil(sortedAttempts.length / 2));
          const firstAvg = firstHalf.reduce((sum, a) => sum + a.percentage, 0) / firstHalf.length;
          const secondAvg = secondHalf.reduce((sum, a) => sum + a.percentage, 0) / secondHalf.length;

          if (secondAvg > firstAvg + 5) trend = 'improving';
          else if (secondAvg < firstAvg - 5) trend = 'declining';
        }

        // Determine performance level
        let performanceLevel = 'Needs Improvement';
        if (averagePercentage >= 90) performanceLevel = 'Excellent';
        else if (averagePercentage >= 80) performanceLevel = 'Very Good';
        else if (averagePercentage >= 70) performanceLevel = 'Good';
        else if (averagePercentage >= 60) performanceLevel = 'Average';

        return {
          quizId: quiz.quizId,
          courseName: quiz.courseName,
          totalAttempts: sortedAttempts.length,
          averageScore: Math.round(sortedAttempts.reduce((sum, a) => sum + a.score, 0) / sortedAttempts.length),
          averagePercentage,
          highestScore: highest.score,
          highestPercentage: highest.percentage,
          latestScore: latest.score,
          latestPercentage: latest.percentage,
          latestPassed: latest.passed,
          latestDifficulty: latest.difficulty,
          performanceLevel,
          trend,
          firstAttemptTimestamp: quiz.firstAttempt,
          lastAttemptTimestamp: quiz.lastAttempt,
          formattedFirstAttempt: this.formatTimestamp(quiz.firstAttempt),
          formattedLastAttempt: this.formatTimestamp(quiz.lastAttempt)
        };
      });

      const totalAttempts = quizzes.reduce((sum, q) => sum + q.totalAttempts, 0);
      const averageScore = quizzes.length > 0
        ? Math.round(quizzes.reduce((sum, q) => sum + q.averageScore, 0) / quizzes.length)
        : 0;
      const passRate = quizzes.length > 0
        ? Math.round(quizzes.reduce((sum, q) => sum + q.averagePercentage, 0) / quizzes.length)
        : 0;

      logger.info(`✅ Processed ${quizzes.length} quizzes with ${totalAttempts} total attempts`);

      return {
        data: quizzes,
        count: quizzes.length,
        totalAttempts,
        averageScore,
        passRate
      };
    } catch (error) {
      logger.error('❌ Failed to get quiz performance:', { userId, error: error.message, stack: error.stack });
      // Return empty data instead of throwing to prevent dashboard from failing
      return {
        data: [],
        count: 0,
        totalAttempts: 0,
        averageScore: 0,
        passRate: 0
      };
    }
  }

  // Get all users with pagination
  static async getAllUsersWithPagination(options = {}) {
    try {
      const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = options;

      logger.info('📊 Fetching users with pagination', { page, limit, sortBy, order });

      // Fetch all users without ordering to avoid index issues
      const usersSnapshot = await db.collection('users').get();

      const allUsers = [];
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        allUsers.push({
          id: doc.id,
          userId: userData.userId || doc.id,
          username: userData.username || 'N/A',
          email: userData.email || 'N/A',
          coursesTaken: userData.coursesTaken || [],
          createdAt: userData.createdAt || null
        });
      });

      // Sort in memory if needed
      if (sortBy && allUsers.length > 0) {
        allUsers.sort((a, b) => {
          const aValue = a[sortBy];
          const bValue = b[sortBy];

          if (!aValue && !bValue) return 0;
          if (!aValue) return order === 'asc' ? -1 : 1;
          if (!bValue) return order === 'asc' ? 1 : -1;

          // Handle timestamp objects
          let aComp = aValue;
          let bComp = bValue;

          if (aValue && aValue._seconds) aComp = aValue._seconds;
          if (bValue && bValue._seconds) bComp = bValue._seconds;

          if (order === 'asc') {
            return aComp > bComp ? 1 : -1;
          } else {
            return aComp < bComp ? 1 : -1;
          }
        });
      }

      const total = allUsers.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const users = allUsers.slice(startIndex, endIndex);

      logger.info(`✅ Retrieved ${users.length} users out of ${total} total`);

      return {
        users,
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      };
    } catch (error) {
      logger.error('❌ Failed to get users with pagination:', { error: error.message, stack: error.stack });
      throw new Error('Failed to get users with pagination');
    }
  }

  // Get user statistics
  static async getUserStatistics(userId) {
    try {
      const dashboard = await this.getUserDashboard(userId);
      return dashboard.overallStats;
    } catch (error) {
      logger.error('❌ Failed to get user statistics:', { userId, error: error.message });
      throw new Error('Failed to get user statistics');
    }
  }

  // Helper method to format timestamps
  static formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';

    let date;
    if (timestamp._seconds) {
      date = new Date(timestamp._seconds * 1000);
    } else if (timestamp.toDate) {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

module.exports = UserService;