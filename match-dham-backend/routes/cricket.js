
const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = '26d7de00-35e1-47a8-aea7-54b76903ba57';
const BASE_URL = 'https://api.cricapi.com/v1';

// 1. 🌍 Countries with Flags
router.get('/countries', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/countries?apikey=${API_KEY}&offset=0`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, error: "Countries list fetch karne mein dikkat hui" });
    }
});

// 2. 🏆 Cricket Series List & Search (IPL etc.)
router.get('/series', async (req, res) => {
    const search = req.query.search || '';
    try {
        const response = await axios.get(`${BASE_URL}/series?apikey=${API_KEY}&offset=0&search=${search}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, error: "Series data load nahi hua" });
    }
});

// 3. 📅 All Matches List (Upcoming + Past + Live)
router.get('/matches', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/matches?apikey=${API_KEY}&offset=0`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, error: "All matches list fetch karne mein dikkat hui" });
    }
});

// 4. 🏏 Current Matches List (Live Score)
router.get('/current-matches', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/currentMatches?apikey=${API_KEY}&offset=0`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, error: "Live matches data fetch karne mein dikkat hui" });
    }
});

// 5. 👥 All Players List & Search Players
router.get('/players', async (req, res) => {
    const search = req.query.search || '';
    try {
        const response = await axios.get(`${BASE_URL}/players?apikey=${API_KEY}&offset=0&search=${search}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, error: "Players list load nahi hui" });
    }
});

// 6. ℹ️ Series Info (Using Specific ID)
router.get('/series-info/:id', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/series_info?apikey=${API_KEY}&offset=0&id=${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, error: "Series Info details load nahi hui" });
    }
});

// 📊 7. Match Info (Using Specific ID)
router.get('/match-info/:id', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/match_info?apikey=${API_KEY}&offset=0&id=${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, error: "Match info load nahi hui" });
    }
});

// 👤 8. Player Info (Using Specific ID)
router.get('/player-info/:id', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/players_info?apikey=${API_KEY}&offset=0&id=${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, error: "Player details load nahi hui" });
    }
});

module.exports = router;


