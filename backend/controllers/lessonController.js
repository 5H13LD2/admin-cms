const { lessonService } = require('../services');
const logger = require('../utils/logger');

const lessonController = {
  // Get lessons by module
  getLessonsByModule: async (req, res) => {
    try {
      const { moduleId } = req.params;
      const lessons = await lessonService.getLessonsByModule(moduleId);

      res.json({
        success: true,
        data: lessons,
        count: lessons.length,
      });
    } catch (error) {
      logger.error('Error in getLessonsByModule:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get lessons',
        error: error.message,
      });
    }
  },

  // Get lesson by ID
  getLessonById: async (req, res) => {
    try {
      const { id } = req.params;
      const lesson = await lessonService.getLessonById(id);

      if (!lesson) {
        return res.status(404).json({
          success: false,
          message: 'Lesson not found',
        });
      }

      res.json({
        success: true,
        data: lesson,
      });
    } catch (error) {
      logger.error('Error in getLessonById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get lesson',
        error: error.message,
      });
    }
  },

  // Create lesson
  createLesson: async (req, res) => {
    try {
      const lessonData = req.body;
      const lesson = await lessonService.createLesson(lessonData);

      res.status(201).json({
        success: true,
        message: 'Lesson created successfully',
        data: lesson,
      });
    } catch (error) {
      logger.error('Error in createLesson:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create lesson',
        error: error.message,
      });
    }
  },

  // Update lesson
  updateLesson: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const lesson = await lessonService.updateLesson(id, updates);

      res.json({
        success: true,
        message: 'Lesson updated successfully',
        data: lesson,
      });
    } catch (error) {
      logger.error('Error in updateLesson:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update lesson',
        error: error.message,
      });
    }
  },

  // Delete lesson
  deleteLesson: async (req, res) => {
    try {
      const { id } = req.params;
      await lessonService.deleteLesson(id);

      res.json({
        success: true,
        message: 'Lesson deleted successfully',
      });
    } catch (error) {
      logger.error('Error in deleteLesson:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete lesson',
        error: error.message,
      });
    }
  },
};

module.exports = lessonController;
