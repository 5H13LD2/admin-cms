const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getAuth } = require('../config/firebase-admin');
const { getFirestore } = require('../config/firebase-admin');
const logger = require('../utils/logger');

const authController = {
  // Login with email and password
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const db = getFirestore();

      // Find user in Firestore
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).limit(1).get();

      if (snapshot.empty) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      // Verify password
      const isValidPassword = await bcrypt.compare(password, userData.password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: userDoc.id,
          email: userData.email,
          role: userData.role,
          firebaseUid: userData.firebaseUid,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Update last login
      await usersRef.doc(userDoc.id).update({
        lastLogin: new Date().toISOString(),
      });

      logger.info(`User logged in: ${email}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: userDoc.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
          },
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message,
      });
    }
  },

  // Register new user
  register: async (req, res) => {
    try {
      const { email, password, name, role = 'student' } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and name are required',
        });
      }

      const db = getFirestore();
      const usersRef = db.collection('users');

      // Check if user exists
      const existingUser = await usersRef.where('email', '==', email).limit(1).get();

      if (!existingUser.empty) {
        return res.status(409).json({
          success: false,
          message: 'User already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in Firestore
      const newUser = {
        email,
        password: hashedPassword,
        name,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const userRef = await usersRef.add(newUser);

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: userRef.id,
          email,
          name,
          role,
        },
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message,
      });
    }
  },

  // Logout
  logout: async (req, res) => {
    try {
      // For JWT-based auth, logout is primarily client-side
      // Server can optionally blacklist tokens or log the event

      logger.info(`User logged out: ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: error.message,
      });
    }
  },

  // Verify token
  verifyToken: async (req, res) => {
    try {
      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      logger.error('Token verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Token verification failed',
        error: error.message,
      });
    }
  },
};

module.exports = authController;
