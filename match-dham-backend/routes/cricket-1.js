/**
 * Cricket API Routes
 * Handles cricket score, match data, and statistics
 * All API calls made from backend - keys never exposed to frontend
 */

const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger');

const router = express.Router();

// Cricket API Configuration
const CRICKET_API_BASE_URL = 'https://cricketdata.org/api';
const CRICKET_API_KEY = process.env.CRICKET_API_KEY;

// ========== CRICKET ENDPOINTS ==========

/**
 * GET /api/cricket/live-matches
 * Returns all live cricket matches
 * Response time: ~500-1000ms
 */
router.get('/live-matches', async (req, res, next) => {
  try {
    logger.info('Fetching live matches from Cricket API');
    
    const response = await axios.get(
      `${CRICKET_API_BASE_URL}/matches?apikey=${CRICKET_API_KEY}`,
      {
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'Match-Dham-Backend/1.0'
        }
      }
    );

    // Return only relevant data to frontend
    const matches = response.data?.data || [];
    
    res.json({
      success: true,
      count: matches.length,
      data: matches.slice(0, 10), // Limit to 10 matches
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Cricket API Error:', error.message);
    next(error);
  }
});

/**
 * GET /api/cricket/match/:matchId
 * Returns details for a specific match
 */
router.get('/match/:matchId', async (req, res, next) => {
  try {
    const { matchId } = req.params;
    
    if (!matchId) {
      return res.status(400).json({ error: 'Match ID is required' });
    }

    logger.info(`Fetching match ${matchId} from Cricket API`);

    const response = await axios.get(
      `${CRICKET_API_BASE_URL}/match/${matchId}?apikey=${CRICKET_API_KEY}`,
      {
        timeout: 10000
      }
    );

    res.json({
      success: true,
      data: response.data?.data || {},
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Match Detail Error:', error.message);
    next(error);
  }
});

/**
 * GET /api/cricket/upcoming
 * Returns upcoming cricket matches
 */
router.get('/upcoming', async (req, res, next) => {
  try {
    logger.info('Fetching upcoming matches');

    const response = await axios.get(
      `${CRICKET_API_BASE_URL}/matches?apikey=${CRICKET_API_KEY}&status=upcoming`,
      {
        timeout: 10000
      }
    );

    const matches = response.data?.data || [];

    res.json({
      success: true,
      count: matches.length,
      data: matches.slice(0, 20),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Upcoming Matches Error:', error.message);
    next(error);
  }
});

/**
 * GET /api/cricket/recent-results
 * Returns recently completed matches
 */
router.get('/recent-results', async (req, res, next) => {
  try {
    logger.info('Fetching recent results');

    const response = await axios.get(
      `${CRICKET_API_BASE_URL}/matches?apikey=${CRICKET_API_KEY}&status=recent`,
      {
        timeout: 10000
      }
    );

    const matches = response.data?.data || [];

    res.json({
      success: true,
      count: matches.length,
      data: matches.slice(0, 15),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Recent Results Error:', error.message);
    next(error);
  }
});

/**
 * GET /api/cricket/series
 * Returns cricket series information
 */
router.get('/series', async (req, res, next) => {
  try {
    logger.info('Fetching cricket series');

    const response = await axios.get(
      `${CRICKET_API_BASE_URL}/series?apikey=${CRICKET_API_KEY}`,
      {
        timeout: 10000
      }
    );

    res.json({
      success: true,
      data: response.data?.data || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Series Error:', error.message);
    next(error);
  }
});

module.exports = router;
