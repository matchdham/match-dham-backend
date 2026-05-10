const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger');
const router = express.Router();

// ✅ सही URL: https://api.cricketdata.org/v1
const CRICKET_API_BASE_URL = 'https://api.cricketdata.org/v1';
const CRICKET_API_KEY = process.env.CRICKET_API_KEY;

router.get('/matches', async (req, res, next) => {
  try {
    logger.info('Fetching live matches from Cricket API');
    
    // ✅ Endpoint को 'currentMatches' पर सेट किया गया है
    const response = await axios.get(
      `${CRICKET_API_BASE_URL}/currentMatches?apikey=${CRICKET_API_KEY}`,
      { timeout: 15000 }
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
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
