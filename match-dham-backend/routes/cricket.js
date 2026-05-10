const express = require('express');
const axios = require('axios');
const router = express.Router();

// ✅ सही URL: https://api.cricketdata.org/v1 ( documentation के अनुसार)
const CRICKET_API_BASE_URL = 'https://api.cricketdata.org/v1';
const CRICKET_API_KEY = process.env.CRICKET_API_KEY;

router.get('/matches', async (req, res) => {
  try {
    // ✅ Endpoint को 'currentMatches' पर सेट किया गया है
    const response = await axios.get(
      `${CRICKET_API_BASE_URL}/currentMatches?apikey=${CRICKET_API_KEY}`,
      { timeout: 15000 }
    );

    // अगर API ने डेटा भेज दिया
    res.json({
      success: true,
      data: response.data?.data || [],
      count: response.data?.data ? response.data.data.length : 0
    });

  } catch (error) {
    // अगर फिर भी नेटवर्क एरर आए
    res.status(500).json({ 
      success: false, 
      error: "API se data lene mein dikkat hai. Link ya Key check karein." 
    });
  }
});

module.exports = router; 
