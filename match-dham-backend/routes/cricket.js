const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = '26d7de00-35e1-47a8-aea7-54b76903ba57';
const BASE_URL = 'https://api.cricapi.com/v1';

// 🏏 1. Current Matches List
router.get('/current-matches', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/currentMatches?apikey=${API_KEY}&offset=0`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Data fetch karne mein dikkat hui" });
    }
});

// 📊 2. Match Info (Using ID)
router.get('/match-info/:id', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/match_info?apikey=${API_KEY}&id=${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Match info load nahi hui" });
    }
});

// 🏆 3. Series List & Search
router.get('/series', async (req, res) => {
    const search = req.query.search || '';
    try {
        const response = await axios.get(`${BASE_URL}/series?apikey=${API_KEY}&offset=0&search=${search}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Series data error" });
    }
});

// 👤 4. Player Info (Using ID)
router.get('/player/:id', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/players_info?apikey=${API_KEY}&id=${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Player details error" });
    }
});

// 🚩 5. Countries with Flags
router.get('/countries', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/countries?apikey=${API_KEY}&offset=0`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Countries load nahi hui" });
    }
});

module.exports = router;


