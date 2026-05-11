const express = require('express');
const axios = require('axios');
const router = express.Router();

// ✅ Wahi base URL jo tumne Chrome mein test kiya
const BASE_URL = 'https://api.cricapi.com/v1';
const KEY = process.env.CRICKET_API_KEY;

// 🏏 1. Saare Matches ki List (Current/Live)
router.get('/matches', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/currentMatches?apikey=${KEY}&offset=0`);
    res.json({ success: true, data: response.data.data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: "Matches load nahi ho paaye" });
  }
});

// 📊 2. Match ka Scorecard (Live Score)
router.get('/score/:id', async (req, res) => {
  try {
    const matchId = req.params.id;
    const response = await axios.get(`${BASE_URL}/match_scorecard?apikey=${KEY}&id=${matchId}`);
    res.json({ success: true, data: response.data.data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Score fetch nahi hua" });
  }
});

// 📋 3. Match ki Detailed Info (Toss, Playing XI)
router.get('/match-info/:id', async (req, res) => {
  try {
    const matchId = req.params.id;
    const response = await axios.get(`${BASE_URL}/match_info?apikey=${KEY}&id=${matchId}`);
    res.json({ success: true, data: response.data.data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Match info error" });
  }
});

// 👤 4. Player ki Profile (Records, Career)
router.get('/player/:id', async (req, res) => {
  try {
    const playerId = req.params.id;
    const response = await axios.get(`${BASE_URL}/players_info?apikey=${KEY}&id=${playerId}`);
    res.json({ success: true, data: response.data.data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Player details error" });
  }
});

// 🏆 5. Series/Tournament List (IPL, World Cup)
router.get('/series', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/series?apikey=${KEY}&offset=0`);
    res.json({ success: true, data: response.data.data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: "Series list error" });
  }
});

module.exports = router;

