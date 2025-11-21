const { getFirestore } = require('../../config/firebase-admin');
const admin = require('firebase-admin');
const logger = require('../../utils/logger');

class CoursesService {
  // Get all courses
  static async getAllCourses() {
    try {
      const db = getFirestore();
      const coursesSnapshot = await db.collection('courses').get();
      const courses = [];
      
      coursesSnapshot.forEach(doc => {
        const courseData = doc.data();
        courses.push({
          id: doc.id,
          courseId: doc.id,
          title: courseData.title || doc.id,
          courseName: courseData.courseName || doc.id,
          description: courseData.description || 'No description available',
          difficulty: courseData.difficulty || 'Beginner',
          language: courseData.language || 'General',
          duration: courseData.duration || 0,
          thumbnail: courseData.thumbnail || null,
          enrolledUsers: courseData.enrolledUsers || [],
          enrolledStudents: courseData.enrolledUsers?.length || 0,
          rating: courseData.rating || 0,
          status: courseData.status || 'active',
          createdAt: courseData.createdAt || null,
          updatedAt: courseData.updatedAt || null
        });
      });
      
      return courses;
    } catch (error) {
      logger.error('❌ Failed to retrieve courses:', error);
      throw new Error('Failed to retrieve courses from database');
    }
  }

  // Get course by name
  static async getCourseByName(courseName) {
    try {
      const courseSnapshot = await db.collection('courses')
        .where('courseName', '==', courseName)
        .limit(1)
        .get();
      
      if (courseSnapshot.empty) {
        // Also try searching by title field
        const titleSnapshot = await db.collection('courses')
          .where('title', '==', courseName)
          .limit(1)
          .get();
        
        if (titleSnapshot.empty) {
          return null;
        }
        
        const courseDoc = titleSnapshot.docs[0];
        const courseData = courseDoc.data();
        
        return {
          id: courseDoc.id,
          courseId: courseData.courseId || courseDoc.id,
          title: courseData.title || courseData.courseName,
          courseName: courseData.courseName || courseData.title,
          description: courseData.description || 'No description available',
          difficulty: courseData.difficulty || 'Beginner',
          language: courseData.language || 'General',
          duration: courseData.duration || 0,
          thumbnail: courseData.thumbnail || null,
          enrolledUsers: courseData.enrolledUsers || [],
          enrolledStudents: courseData.enrolledStudents || courseData.enrolledUsers?.length || 0,
          rating: courseData.rating || 0,
          status: courseData.status || 'active',
          createdAt: courseData.createdAt || null,
          updatedAt: courseData.updatedAt || null
        };
      }
      
      const courseDoc = courseSnapshot.docs[0];
      const courseData = courseDoc.data();
      
      return {
        id: courseDoc.id,
        courseId: courseData.courseId || courseDoc.id,
        title: courseData.title || courseData.courseName,
        courseName: courseData.courseName || courseData.title,
        description: courseData.description || 'No description available',
        difficulty: courseData.difficulty || 'Beginner',
        language: courseData.language || 'General',
        duration: courseData.duration || 0,
        thumbnail: courseData.thumbnail || null,
        enrolledUsers: courseData.enrolledUsers || [],
        enrolledStudents: courseData.enrolledStudents || courseData.enrolledUsers?.length || 0,
        rating: courseData.rating || 0,
        status: courseData.status || 'active',
        createdAt: courseData.createdAt || null,
        updatedAt: courseData.updatedAt || null
      };
    } catch (error) {
      logger.error('❌ Failed to find course by name:', error);
      throw new Error('Failed to find course');
    }
  }

  // Get course by ID
  static async getCourseById(courseId) {
    try {
      const courseDoc = await db.collection('courses').doc(courseId).get();
      
      if (!courseDoc.exists) {
        return null;
      }
      
      const courseData = courseDoc.data();
      
      return {
        id: courseDoc.id,
        courseId: courseData.courseId || courseDoc.id,
        title: courseData.title || courseData.courseName,
        courseName: courseData.courseName || courseData.title,
        description: courseData.description || 'No description available',
        difficulty: courseData.difficulty || 'Beginner',
        language: courseData.language || 'General',
        duration: courseData.duration || 0,
        thumbnail: courseData.thumbnail || null,
        enrolledUsers: courseData.enrolledUsers || [],
        enrolledStudents: courseData.enrolledStudents || courseData.enrolledUsers?.length || 0,
        rating: courseData.rating || 0,
        status: courseData.status || 'active',
        createdAt: courseData.createdAt || null,
        updatedAt: courseData.updatedAt || null
      };
    } catch (error) {
      logger.error('❌ Failed to find course by ID:', error);
      throw new Error('Failed to find course');
    }
  }

  // Create new course
  static async createCourse(courseData) {
    try {
      const { title, courseName, description, difficulty, language, duration, thumbnail, status } = courseData;
      
      // Generate courseId if not provided
      const courseId = courseData.courseId || `${language?.toLowerCase()}_${Date.now()}`;
      
      // Use courseId as title/courseName if not provided
      const finalTitle = title || courseId;
      const finalCourseName = courseName || courseId;
      
      // Check if course already exists
      const existingCourse = await this.getCourseByName(finalCourseName);
      if (existingCourse) {
        throw new Error('Course with this name already exists');
      }
      
      const newCourse = {
        courseId: courseId,
        title: finalTitle,
        courseName: finalCourseName,
        description: description || 'No description available',
        difficulty: difficulty || 'Beginner',
        language: language || 'General',
        duration: duration || 0,
        thumbnail: thumbnail || null,
        enrolledUsers: [],
        enrolledStudents: 0,
        rating: 0,
        status: status || 'active',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = await db.collection('courses').doc(courseId).set(newCourse);
      
      return {
        id: courseId,
        ...newCourse,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('❌ Failed to create course:', error);
      throw new Error(error.message || 'Failed to create course');
    }
  }

  // Update course
  static async updateCourse(courseId, updateData) {
    try {
      const courseRef = db.collection('courses').doc(courseId);
      const courseDoc = await courseRef.get();
      
      if (!courseDoc.exists) {
        throw new Error('Course not found');
      }
      
      const updatedData = {
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      // If title is being updated, also update courseName for consistency
      if (updateData.title && !updateData.courseName) {
        updatedData.courseName = updateData.title;
      }
      
      // If courseName is being updated, also update title for consistency
      if (updateData.courseName && !updateData.title) {
        updatedData.title = updateData.courseName;
      }
      
      await courseRef.update(updatedData);
      
      return {
        id: courseId,
        ...courseDoc.data(),
        ...updatedData,
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('❌ Failed to update course:', error);
      throw new Error(error.message || 'Failed to update course');
    }
  }

  // Delete course
  static async deleteCourse(courseId) {
    try {
      const courseRef = db.collection('courses').doc(courseId);
      const courseDoc = await courseRef.get();
      
      if (!courseDoc.exists) {
        throw new Error('Course not found');
      }
      
      await courseRef.delete();
      
      return { success: true, message: 'Course deleted successfully' };
    } catch (error) {
      logger.error('❌ Failed to delete course:', error);
      throw new Error(error.message || 'Failed to delete course');
    }
  }

  // Add user to course enrollment list
  static async addUserToCourse(courseId, userEmail) {
    try {
      const courseRef = db.collection('courses').doc(courseId);
      const courseDoc = await courseRef.get();
      
      if (!courseDoc.exists) {
        throw new Error('Course not found');
      }
      
      const courseData = courseDoc.data();
      const enrolledUsers = courseData.enrolledUsers || [];
      
      if (enrolledUsers.includes(userEmail)) {
        throw new Error('User is already enrolled in this course');
      }
      
      const updatedEnrolledUsers = [...enrolledUsers, userEmail];
      
      await courseRef.update({
        enrolledUsers: updatedEnrolledUsers,
        enrolledStudents: updatedEnrolledUsers.length,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true, message: 'User added to course successfully' };
    } catch (error) {
      logger.error('❌ Failed to add user to course:', error);
      throw new Error(error.message || 'Failed to add user to course');
    }
  }

  // Remove user from course enrollment list
  static async removeUserFromCourse(courseId, userEmail) {
    try {
      const courseRef = db.collection('courses').doc(courseId);
      const courseDoc = await courseRef.get();
      
      if (!courseDoc.exists) {
        throw new Error('Course not found');
      }
      
      const courseData = courseDoc.data();
      const enrolledUsers = courseData.enrolledUsers || [];
      
      const updatedEnrolledUsers = enrolledUsers.filter(email => email !== userEmail);
      
      await courseRef.update({
        enrolledUsers: updatedEnrolledUsers,
        enrolledStudents: updatedEnrolledUsers.length,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true, message: 'User removed from course successfully' };
    } catch (error) {
      logger.error('❌ Failed to remove user from course:', error);
      throw new Error(error.message || 'Failed to remove user from course');
    }
  }

  // Get enrolled users for a course
  static async getEnrolledUsers(courseId) {
    try {
      const courseDoc = await db.collection('courses').doc(courseId).get();
      
      if (!courseDoc.exists) {
        throw new Error('Course not found');
      }
      
      const courseData = courseDoc.data();
      return courseData.enrolledUsers || [];
    } catch (error) {
      logger.error('❌ Failed to retrieve enrolled users:', error);
      throw new Error('Failed to retrieve enrolled users');
    }
  }

  // Get course modules
  static async getCourseModules(courseId) {
    try {
      // First get all modules for the course
      const modulesSnapshot = await db.collection('modules')
        .where('courseId', '==', courseId)
        .get();
      
      const modules = [];
      modulesSnapshot.forEach(doc => {
        const moduleData = doc.data();
        modules.push({
          id: doc.id,
          moduleId: moduleData.moduleId || doc.id,
          courseId: moduleData.courseId,
          title: moduleData.title || 'Untitled Module',
          description: moduleData.description || 'No description available',
          order: moduleData.order || 0,
          estimatedMinutes: moduleData.estimatedMinutes || 0,
          totalLessons: moduleData.totalLessons || 0,
          lessons: moduleData.lessons || []
        });
      });
      
      // Sort modules by order in memory instead of in the query
      modules.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      return modules;
    } catch (error) {
      logger.error('❌ Failed to retrieve course modules:', error);
      throw new Error('Failed to retrieve course modules');
    }
  }

  // Get course enrollments
  static async getCourseEnrollments(courseId) {
    try {
      const courseDoc = await db.collection('courses').doc(courseId).get();
      
      if (!courseDoc.exists) {
        throw new Error('Course not found');
      }
      
      const courseData = courseDoc.data();
      return courseData.enrolledUsers || [];
    } catch (error) {
      logger.error('❌ Failed to retrieve course enrollments:', error);
      throw new Error('Failed to retrieve course enrollments');
    }
  }

  // Get module by ID
  static async getModuleById(courseId, moduleId) {
    try {
      // Try both 'modules' and 'module' subcollections
      const moduleCollections = ['modules', 'module'];
      
      for (const moduleCollection of moduleCollections) {
        try {
          const moduleDoc = await db
            .collection('courses')
            .doc(courseId)
            .collection(moduleCollection)
            .doc(moduleId)
            .get();

          if (moduleDoc.exists) {
            const moduleData = moduleDoc.data();
            return {
              id: moduleData.id || moduleDoc.id,
              moduleId: moduleData.moduleId || moduleData.id || moduleDoc.id,
              courseId: moduleData.courseId || courseId,
              title: moduleData.title,
              description: moduleData.description,
              order: moduleData.order || 0,
              estimatedMinutes: moduleData.estimatedMinutes || moduleData.estimatedMinutess || 0,
              totalLessons: moduleData.totalLessons || 0,
              isUnlocked: moduleData.isUnlocked || false,
              createdAt: moduleData.createdAt,
              updatedAt: moduleData.updatedAt,
              source: moduleCollection
            };
          }
        } catch (error) {
          logger.error(`Error checking ${moduleCollection}:`, error);
        }
      }
      
      return null;
    } catch (error) {
      logger.error('Failed to retrieve module:', error);
      throw new Error('Failed to retrieve module');
    }
  }
}

module.exports = CoursesService;