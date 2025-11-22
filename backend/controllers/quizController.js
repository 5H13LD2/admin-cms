// ================================
// controllers/quizController.js
// ================================

const quizService = require('../services/firestore/quizServices');
const logger = require('../utils/logger');

// 📚 Get all quizzes for a course (with optional module filter and pagination)
exports.getQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { module, limit = 10, page = 1 } = req.query; // Optional filters and pagination

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);

    const result = await quizService.getQuizzes(courseId, module, limitNum, pageNum);

    res.status(200).json({
      success: true,
      message: "Quizzes retrieved successfully",
      data: result.quizzes,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error('Error in getQuizzes controller:', error);
    res.status(500).json({
      success: false,
      message: "Error retrieving quizzes",
      error: error.message
    });
  }
};

// ➕ Add a new quiz
exports.addQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizData = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    // Validate required fields for new structure
    if (!quizData.question) {
      return res.status(400).json({
        success: false,
        message: "Question text is required"
      });
    }

    if (!quizData.options || !Array.isArray(quizData.options) || quizData.options.length !== 4) {
      return res.status(400).json({
        success: false,
        message: "Four answer options are required as an array"
      });
    }

    if (typeof quizData.correctOptionIndex !== 'number' || 
        quizData.correctOptionIndex < 0 || 
        quizData.correctOptionIndex > 3) {
      return res.status(400).json({
        success: false,
        message: "Correct option index must be a number between 0 and 3"
      });
    }

    if (!quizData.module_id) {
      return res.status(400).json({
        success: false,
        message: "Module ID is required"
      });
    }

    const newQuiz = await quizService.addQuiz(courseId, quizData);

    res.status(201).json({
      success: true,
      message: "Quiz added successfully",
      data: newQuiz
    });
  } catch (error) {
    logger.error('Error in addQuiz controller:', error);
    res.status(500).json({
      success: false,
      message: "Error adding quiz",
      error: error.message
    });
  }
};

// ✏️ Update a quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { courseId, questionId } = req.params;
    const updatedData = req.body;

    if (!courseId || !questionId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Question ID are required"
      });
    }

    // Validate options if provided
    if (updatedData.options && 
        (!Array.isArray(updatedData.options) || updatedData.options.length !== 4)) {
      return res.status(400).json({
        success: false,
        message: "Options must be an array with exactly 4 elements"
      });
    }

    // Validate correctOptionIndex if provided
    if (updatedData.correctOptionIndex !== undefined && 
        (typeof updatedData.correctOptionIndex !== 'number' || 
         updatedData.correctOptionIndex < 0 || 
         updatedData.correctOptionIndex > 3)) {
      return res.status(400).json({
        success: false,
        message: "Correct option index must be a number between 0 and 3"
      });
    }

    const updatedQuiz = await quizService.updateQuiz(courseId, questionId, updatedData);

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: updatedQuiz
    });
  } catch (error) {
    logger.error('Error in updateQuiz controller:', error);
    
    if (error.message === 'Quiz question not found') {
      return res.status(404).json({
        success: false,
        message: "Quiz question not found"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating quiz",
      error: error.message
    });
  }
};

// ❌ Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { courseId, questionId } = req.params;

    if (!courseId || !questionId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Question ID are required"
      });
    }

    const result = await quizService.deleteQuiz(courseId, questionId);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    logger.error('Error in deleteQuiz controller:', error);
    
    if (error.message === 'Quiz question not found') {
      return res.status(404).json({
        success: false,
        message: "Quiz question not found"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting quiz",
      error: error.message
    });
  }
};

// 📊 Get quiz statistics
exports.getQuizStats = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    const stats = await quizService.getQuizStats(courseId);

    res.status(200).json({
      success: true,
      message: "Quiz statistics retrieved successfully",
      data: stats
    });
  } catch (error) {
    logger.error('Error in getQuizStats controller:', error);
    res.status(500).json({
      success: false,
      message: "Error retrieving quiz statistics",
      error: error.message
    });
  }
};