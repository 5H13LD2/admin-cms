const { getFirestore } = require('../../config/firebase-admin');
const logger = require('../../utils/logger');

class TechnicalAssessmentService {
    constructor() {
        this.collectionName = 'technical_assessments';
        this.logger = logger.child({ service: 'TechnicalAssessmentService' });
    }

    /**
     * Get all technical assessments
     */
    static async getAllTechnicalAssessments() {
        try {
            const db = getFirestore();
            const snapshot = await db.collection('technical_assessments').get();

            const assessments = [];
            snapshot.forEach(doc => {
                assessments.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            logger.info(`Retrieved ${assessments.length} technical assessments`);
            return assessments;
        } catch (error) {
            logger.error('Error getting all technical assessments:', error);
            throw error;
        }
    }

    /**
     * Get technical assessment by ID
     */
    static async getTechnicalAssessmentById(id) {
        try {
            const db = getFirestore();
            const doc = await db.collection('technical_assessments').doc(id).get();

            if (!doc.exists) {
                return null;
            }

            return {
                id: doc.id,
                ...doc.data()
            };
        } catch (error) {
            logger.error(`Error getting technical assessment ${id}:`, error);
            throw error;
        }
    }

    /**
     * Create a new technical assessment
     */
    static async createTechnicalAssessment(data) {
        try {
            const db = getFirestore();
            const docRef = await db.collection('technical_assessments').add({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            logger.info(`Created technical assessment with ID: ${docRef.id}`);
            return {
                id: docRef.id,
                ...data
            };
        } catch (error) {
            logger.error('Error creating technical assessment:', error);
            throw error;
        }
    }

    /**
     * Update technical assessment
     */
    static async updateTechnicalAssessment(id, data) {
        try {
            const db = getFirestore();
            await db.collection('technical_assessments').doc(id).update({
                ...data,
                updatedAt: new Date()
            });

            logger.info(`Updated technical assessment: ${id}`);
            return {
                id,
                ...data
            };
        } catch (error) {
            logger.error(`Error updating technical assessment ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete technical assessment
     */
    static async deleteTechnicalAssessment(id) {
        try {
            const db = getFirestore();
            await db.collection('technical_assessments').doc(id).delete();

            logger.info(`Deleted technical assessment: ${id}`);
            return { success: true };
        } catch (error) {
            logger.error(`Error deleting technical assessment ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get active technical assessments
     */
    static async getActiveTechnicalAssessments() {
        try {
            const db = getFirestore();
            const snapshot = await db.collection('technical_assessments')
                .where('isActive', '==', true)
                .get();

            const assessments = [];
            snapshot.forEach(doc => {
                assessments.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            logger.info(`Retrieved ${assessments.length} active technical assessments`);
            return assessments;
        } catch (error) {
            logger.error('Error getting active technical assessments:', error);
            throw error;
        }
    }

    /**
     * Get technical assessments by type
     */
    static async getTechnicalAssessmentsByType(type) {
        try {
            const db = getFirestore();
            const snapshot = await db.collection('technical_assessments')
                .where('type', '==', type)
                .get();

            const assessments = [];
            snapshot.forEach(doc => {
                assessments.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            logger.info(`Retrieved ${assessments.length} technical assessments of type: ${type}`);
            return assessments;
        } catch (error) {
            logger.error(`Error getting technical assessments by type ${type}:`, error);
            throw error;
        }
    }
}

module.exports = TechnicalAssessmentService;
