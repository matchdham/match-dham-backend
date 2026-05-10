/**
 * Match Dham - Corrected Cricket API Route
 * Fixes the Base URL and Endpoint for CricketData.org
 */

const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger');

const router = express.Router();

// ✅ CORRECT BASE URL for CricketData.org V1
const CRICKET_API_BASE_URL = 'https://api.cricketdata.org/v1';
const CRICKET_API_KEY = process.env.CRICKET_API_KEY;

/**
 * GET /api/cricket/matches
 * Returns current and live matches
 */
router.get('/matches', async (req, res, next) => {
  try {
    logger.info('Fetching matches from Cricket API');
    
    // ✅ Endpoint fixed to currentMatches
    const response = await axios.get(
      `${CRICKET_API_BASE_URL}/currentMatches?apikey=${CRICKET_API_KEY}`,
      { timeout: 10000 }
    );

    const matches = response.data?.data || [];
    
    res.json({
      success: true,
      count: matches.length,
      data: matches,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Cricket API Error:', error.message);
    next(error);
  }
});

// इसे भी अपडेट कर दिया है (Specific match detail)
router.get('/match/:matchId', async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const response = await axios.get(
      `${CRICKET_API_BASE_URL}/match_info?apikey=${CRICKET_API_KEY}&id=${matchId}`,
      { timeout: 10000 }
    );
    res.json({
      success: true,
      data: response.data?.data || {}
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
