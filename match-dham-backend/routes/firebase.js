/**
 * Firebase Database Routes
 * Handles leaderboard, user profiles, and game data
 * Firebase credentials are kept safe on backend
 */

const express = require('express');
const admin = require('firebase-admin');
const logger = require('../utils/logger');
const { validateUserId, validateScore } = require('../utils/validators');

const router = express.Router();

// Initialize Firebase (see config/firebase.js for details)
// This is done in server.js

// ========== FIREBASE ENDPOINTS ==========

/**
 * GET /api/firebase/leaderboard
 * Returns top players leaderboard
 * Query params: limit=10, offset=0
 */
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    logger.info(`Fetching leaderboard - limit: ${limit}, offset: ${offset}`);

    const db = admin.database();
    const snapshot = await db.ref('leaderboard')
      .orderByChild('score')
      .limitToLast(parseInt(limit))
      .once('value');

    const data = snapshot.val() || {};
    const leaderboard = Object.entries(data)
      .map(([key, value]) => ({
        userId: key,
        ...value
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Leaderboard Fetch Error:', error.message);
    next(error);
  }
});

/**
 * GET /api/firebase/user/:userId
 * Returns user profile and stats
 */
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Validate userId
    const validation = validateUserId(userId);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    logger.info(`Fetching user profile: ${userId}`);

    const db = admin.database();
    const snapshot = await db.ref(`users/${userId}`).once('value');
    const userData = snapshot.val();

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      userId,
      data: userData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('User Fetch Error:', error.message);
    next(error);
  }
});

/**
 * POST /api/firebase/score
 * Update user score
 * Body: { userId: "user123", score: 100, game: "cricket-quiz" }
 */
router.post('/score', async (req, res, next) => {
  try {
    const { userId, score, game } = req.body;

    // Validate inputs
    if (!validateUserId(userId).valid) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!validateScore(score).valid) {
      return res.status(400).json({ error: 'Invalid score' });
    }

    logger.info(`Updating score for user ${userId}: ${score} points from ${game}`);

    const db = admin.database();
    const timestamp = new Date().toISOString();

    // Update user score
    await db.ref(`users/${userId}`).update({
      score: score,
      lastUpdated: timestamp,
      lastGame: game
    });

    // Update leaderboard
    await db.ref(`leaderboard/${userId}`).set({
      score: score,
      userId: userId,
      updatedAt: timestamp
    });

    res.json({
      success: true,
      message: 'Score updated successfully',
      userId,
      score,
      timestamp
    });

  } catch (error) {
    logger.error('Score Update Error:', error.message);
    next(error);
  }
});

/**
 * GET /api/firebase/user-stats/:userId
 * Returns detailed user statistics
 */
router.get('/user-stats/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!validateUserId(userId).valid) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    logger.info(`Fetching stats for user ${userId}`);

    const db = admin.database();
    const snapshot = await db.ref(`users/${userId}/stats`).once('value');
    const stats = snapshot.val() || {};

    res.json({
      success: true,
      userId,
      stats: {
        totalGames: stats.totalGames || 0,
        totalScore: stats.totalScore || 0,
        averageScore: stats.averageScore || 0,
        winRate: stats.winRate || 0,
        ...stats
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Stats Fetch Error:', error.message);
    next(error);
  }
});

/**
 * POST /api/firebase/create-user
 * Create a new user profile
 * Body: { userId: "user123", username: "player1", email: "player@example.com" }
 */
router.post('/create-user', async (req, res, next) => {
  try {
    const { userId, username, email } = req.body;

    if (!validateUserId(userId).valid || !username) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    logger.info(`Creating user profile: ${userId}`);

    const db = admin.database();
    const timestamp = new Date().toISOString();

    await db.ref(`users/${userId}`).set({
      userId,
      username,
      email,
      score: 0,
      createdAt: timestamp,
      coins: 0,
      stats: {
        totalGames: 0,
        totalScore: 0
      }
    });

    res.json({
      success: true,
      message: 'User created successfully',
      userId,
      timestamp
    });

  } catch (error) {
    logger.error('User Creation Error:', error.message);
    next(error);
  }
});

module.exports = router;
