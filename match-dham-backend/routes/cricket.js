
const express = require('express');
const axios = require('axios');
const router = express.Router();

// ✅ Documentation ke hisaab se sahi Base URL
const CRICKET_API_BASE_URL = 'https://api.cricketdata.org/v1';
const CRICKET_API_KEY = process.env.CRICKET_API_KEY;

/**
 * GET /api/cricket/matches
 * Documentation ke 'Current Matches List' API ka use kar raha hai
 */
router.get('/matches', async (req, res) => {
  try {
    // ✅ Documentation ke mutabik: currentMatches?apikey=[key]
    const response = await axios.get(
      `${CRICKET_API_BASE_URL}/currentMatches?apikey=${CRICKET_API_KEY}`,
      { timeout: 15000 }
    );

    // API status check (Documentation: status should be "success")
    if (response.data.status !== "success") {
       return res.status(401).json({ 
         success: false, 
         message: "API Key galat hai ya limit khatam ho gayi hai." 
       });
    }

    res.json({
      success: true,
      count: response.data.data ? response.data.data.length : 0,
      data: response.data.data || [],
      info: response.data.info // Ye check karne ke liye ki kitne 'hits' bache hain
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: "ECONNRESET ya Network error aa gaya hai." 
    });
  }
});

module.exports = router;
