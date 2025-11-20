const CoursesService = require('../services/firestore/courseService');
const logger = require('../utils/logger');

const courseController = {
    async createCourse(req, res) {
        try {
            const { title, courseName, description, difficulty, language, duration, thumbnail, status = 'active' } = req.body;
            
            // Validate required fields
            const missingFields = [];
            if (!title && !courseName) missingFields.push('title or courseName');
            if (!description) missingFields.push('description');
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`,
                    error: 'Validation failed'
                });
            }
            
            const courseData = {
                title: title?.trim(),
                courseName: courseName?.trim(),
                description: description?.trim(),
                difficulty: difficulty || 'Beginner',
                language: language || 'General',
                duration: duration || 0,
                thumbnail: thumbnail?.trim() || null,
                status
            };
            
            const course = await CoursesService.createCourse(courseData);
            
            res.status(201).json({
                success: true,
                message: 'Course created successfully',
                data: course
            });
        } catch (error) {
            logger.error('Error creating course:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create course',
                error: 'Course creation failed'
            });
        }
    },

    async getAllCourses(req, res) {
        try {
            const courses = await CoursesService.getAllCourses();
            res.json({
                success: true,
                data: courses,
                count: courses.length
            });
        } catch (error) {
            logger.error('Error getting courses:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve courses',
                error: 'Failed to retrieve courses'
            });
        }
    },

    async getCourseById(req, res) {
        try {
            const { id } = req.params;
            const course = await CoursesService.getCourseById(id);
            
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            res.json({
                success: true,
                data: course
            });
        } catch (error) {
            logger.error('Error getting course:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve course',
                error: 'Failed to retrieve course'
            });
        }
    },

    async updateCourse(req, res) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };
            
            // Clean up the data
            Object.keys(updateData).forEach(key => {
                if (typeof updateData[key] === 'string') {
                    updateData[key] = updateData[key].trim();
                }
                if (updateData[key] === '') {
                    delete updateData[key];
                }
            });
            
            const course = await CoursesService.updateCourse(id, updateData);
            
            res.json({
                success: true,
                message: 'Course updated successfully',
                data: course
            });
        } catch (error) {
            logger.error('Error updating course:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update course',
                error: 'Failed to update course'
            });
        }
    },

    async deleteCourse(req, res) {
        try {
            const { id } = req.params;
            const result = await CoursesService.deleteCourse(id);
            
            res.json({
                success: true,
                message: result.message || 'Course deleted successfully'
            });
        } catch (error) {
            logger.error('Error deleting course:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to delete course',
                error: 'Failed to delete course'
            });
        }
    },

    async getCourseModules(req, res) {
        try {
            const { id } = req.params;
            const modules = await CoursesService.getCourseModules(id);
            
            res.json({
                success: true,
                data: modules
            });
        } catch (error) {
            logger.error('Error getting course modules:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve course modules',
                error: 'Failed to retrieve course modules'
            });
        }
    },

    async getModuleById(req, res) {
        try {
            const { id, moduleId } = req.params;
            const module = await CoursesService.getModuleById(id, moduleId);
            
            if (!module) {
                return res.status(404).json({
                    success: false,
                    message: 'Module not found'
                });
            }

            res.json({
                success: true,
                data: module
            });
        } catch (error) {
            logger.error('Error getting module:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve module',
                error: 'Failed to retrieve module'
            });
        }
    },

    async getCourseEnrollments(req, res) {
        try {
            const { id } = req.params;
            const enrollments = await CoursesService.getCourseEnrollments(id);
            
            res.json({
                success: true,
                data: enrollments
            });
        } catch (error) {
            logger.error('Error getting course enrollments:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve course enrollments',
                error: 'Failed to retrieve course enrollments'
            });
        }
    },

    async addUserToCourse(req, res) {
        try {
            const { id } = req.params;
            const { userEmail } = req.body;

            if (!userEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'User email is required'
                });
            }

            const result = await CoursesService.addUserToCourse(id, userEmail);
            
            res.json({
                success: true,
                message: result.message || 'User added to course successfully'
            });
        } catch (error) {
            logger.error('Error adding user to course:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to add user to course',
                error: 'Failed to add user to course'
            });
        }
    },

    async removeUserFromCourse(req, res) {
        try {
            const { id } = req.params;
            const { userEmail } = req.body;

            if (!userEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'User email is required'
                });
            }

            const result = await CoursesService.removeUserFromCourse(id, userEmail);
            
            res.json({
                success: true,
                message: result.message || 'User removed from course successfully'
            });
        } catch (error) {
            logger.error('Error removing user from course:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to remove user from course',
                error: 'Failed to remove user from course'
            });
        }
    }
};

module.exports = courseController;