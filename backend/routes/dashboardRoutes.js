const express = require('express');
const router = express.Router();
const dashboardService = require('../services/firestore/dashboardService');
const logger = require('../utils/logger');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await dashboardService.getDashboardStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
});

// Get detailed analytics
router.get('/analytics', async (req, res) => {
    try {
        const analytics = await dashboardService.getAnalytics();
        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        logger.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics'
        });
    }
});

// Get users created chart data
router.get('/charts/users-created', async (req, res) => {
    try {
        const chartData = await dashboardService.getUsersCreatedChartData();
        res.json(chartData);
    } catch (error) {
        logger.error('Error fetching users created chart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users created chart data'
        });
    }
});

// Get leaderboard chart data
router.get('/charts/leaderboard', async (req, res) => {
    try {
        const chartData = await dashboardService.getLeaderboardChartData();
        res.json(chartData);
    } catch (error) {
        logger.error('Error fetching leaderboard chart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard chart data'
        });
    }
});

// Get quiz analytics chart data
router.get('/charts/quiz-analytics', async (req, res) => {
    try {
        const chartData = await dashboardService.getQuizAnalyticsChartData();
        res.json(chartData);
    } catch (error) {
        logger.error('Error fetching quiz analytics chart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quiz analytics chart data'
        });
    }
});

// Get course progress chart data
router.get('/charts/course-progress', async (req, res) => {
    try {
        const chartData = await dashboardService.getCourseProgressChartData();
        res.json(chartData);
    } catch (error) {
        logger.error('Error fetching course progress chart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course progress chart data'
        });
    }
});

// Get achievement insights chart data
router.get('/charts/achievements', async (req, res) => {
    try {
        const chartData = await dashboardService.getAchievementInsightsChartData();
        res.json(chartData);
    } catch (error) {
        logger.error('Error fetching achievements chart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch achievements chart data'
        });
    }
});

// Get all chart data at once (optimized)
router.get('/charts/all', async (req, res) => {
    try {
        const allChartData = await dashboardService.getAllChartData();
        res.json(allChartData);
    } catch (error) {
        logger.error('Error fetching all chart data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch all chart data'
        });
    }
});

module.exports = router;
