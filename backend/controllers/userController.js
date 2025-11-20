const userService = require('../services/firestore/userService');
const logger = require('../utils/logger');

class UserController {
  /**
   * Search user by username or UID
   * GET /api/admin/search-user?query={username|uid}
   */
  async searchUser(req, res) {
    try {
      const { query } = req.query;
      
      if (!query || !query.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      logger.info(`Admin searching for user: ${query}`);

      const user = await userService.searchUser(query.trim());
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User found successfully',
        data: user
      });
    } catch (error) {
      logger.error('Error in searchUser controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search user',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get comprehensive user dashboard data
   * GET /api/admin/user-dashboard/:userId
   */
  async getUserDashboard(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId || !userId.trim()) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      logger.info(`Admin fetching dashboard for user: ${userId}`);

      const dashboard = await userService.getUserDashboard(userId);
      
      if (!dashboard) {
        return res.status(404).json({
          success: false,
          message: 'User dashboard data not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User dashboard retrieved successfully',
        data: dashboard
      });
    } catch (error) {
      logger.error('Error in getUserDashboard controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user dashboard',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get coding challenges for a user
   * GET /api/admin/user/:userId/coding-challenges
   */
  async getUserCodingChallenges(req, res) {
    try {
      const { userId } = req.params;
      
      logger.info(`Admin fetching coding challenges for user: ${userId}`);

      const challenges = await userService.getCodingChallenges(userId);
      
      res.status(200).json({
        success: true,
        message: 'Coding challenges retrieved successfully',
        data: challenges,
        count: challenges.length
      });
    } catch (error) {
      logger.error('Error in getUserCodingChallenges controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve coding challenges',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get quiz performance for a user
   * GET /api/admin/user/:userId/quiz-performance
   */
  async getUserQuizPerformance(req, res) {
    try {
      const { userId } = req.params;
      
      logger.info(`Admin fetching quiz performance for user: ${userId}`);

      const quizPerformance = await userService.getQuizPerformance(userId);
      
      res.status(200).json({
        success: true,
        message: 'Quiz performance retrieved successfully',
        data: quizPerformance,
        count: quizPerformance.length
      });
    } catch (error) {
      logger.error('Error in getUserQuizPerformance controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve quiz performance',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get all users with basic info (for admin user list)
   * GET /api/admin/users
   */
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = req.query;
      
      logger.info('Admin fetching all users');

      const result = await userService.getAllUsersWithPagination({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        order
      });
      
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result.users,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      logger.error('Error in getAllUsers controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get user statistics
   * GET /api/admin/user/:userId/statistics
   */
  async getUserStatistics(req, res) {
    try {
      const { userId } = req.params;
      
      logger.info(`Admin fetching statistics for user: ${userId}`);

      const stats = await userService.getUserStatistics(userId);
      
      res.status(200).json({
        success: true,
        message: 'User statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      logger.error('Error in getUserStatistics controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = new UserController();