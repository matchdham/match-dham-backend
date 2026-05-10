const express = require('express');
const axios = require('axios');
const router = express.Router();

// ✅ जो लिंक तुमने ब्राउज़र में टेस्ट किया, उसका बेस URL
const CRICKET_API_BASE_URL = 'https://api.cricapi.com/v1';
const CRICKET_API_KEY = process.env.CRICKET_API_KEY;

/**
 * GET /api/cricket/matches
 * ब्राउज़र वाले लिंक के लॉजिक पर आधारित
 */
router.get('/matches', async (req, res) => {
  try {
    // ✅ ब्राउज़र वाला सटीक रास्ता: matches?apikey=KEY&offset=0
    const response = await axios.get(
      `${CRICKET_API_BASE_URL}/matches?apikey=${CRICKET_API_KEY}&offset=0`,
      { timeout: 15000 }
    );

    // फ्रंटएंड को डेटा भेजें
    res.json({
      success: true,
      data: response.data.data || [],
      status: response.data.status
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: "Backend API से कनेक्ट नहीं हो पा रहा है।" 
    });
  }
});

module.exports = router;

