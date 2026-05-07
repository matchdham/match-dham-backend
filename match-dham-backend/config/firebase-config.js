/**
 * Firebase Configuration
 * Initializes Firebase Admin SDK with environment variables
 */

const admin = require('firebase-admin');
const logger = require('../utils/logger');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Validate that all required Firebase config keys are present
const requiredKeys = [
  'apiKey', 'authDomain', 'databaseURL', 'projectId',
  'storageBucket', 'messagingSenderId', 'appId'
];

const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  logger.warn('Missing Firebase config keys:', missingKeys.join(', '));
}

// Initialize Firebase Admin
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      databaseURL: firebaseConfig.databaseURL,
      projectId: firebaseConfig.projectId
    });
    
    logger.info('✅ Firebase Admin SDK initialized successfully');
  }
} catch (error) {
  logger.error('Firebase initialization error:', error.message);
}

// Get Firebase Database reference
const database = admin.database();

logger.info('🔥 Firebase Database connected to:', firebaseConfig.databaseURL);

module.exports = { admin, database, firebaseConfig };
