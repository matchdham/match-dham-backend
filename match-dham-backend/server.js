/**
 * ========================================================
 * 🚀 MATCH DHAM BACKEND - MAIN SERVER.JS (FOLDER STRUCTURE FIXED)
 * ========================================================
 * Authorized by: Aryan Raj Dham
 * Managed by: Dham Manager Sahiba
 * * Folder Structure Connected:
 * - config/firebase-config.js
 * - routes/cricket.js | firebase.js | gemini.js
 * - utils/errorHandler.js | logger.js
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const Parser = require('rss-parser');
const NodeCache = require('node-cache');

// Custom Utilities & Configurations
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');
require('./config/firebase-config'); // Automatically initializes Firebase Admin

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // 1 Hour Cache

// ============ MIDDLEWARES & SECURITY ============
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

app.use(cors({
    origin: ['https://cdf7.netlify.app', 'http://localhost:3000', 'http://localhost:5000'],
    credentials: true
}));
app.use(helmet({
    contentSecurityPolicy: false // Content block hone se bachane ke liye
}));
app.use(compression());

// ============ RSS PARSER FOR NEWS ============
const parser = new Parser({
    customFields: { item: ['description', 'link', 'pubDate'] }
});

const RSS_FEEDS = [
    { name: 'ESPNcricinfo', url: 'https://www.espncricinfo.com/feeds/rss/cricket_news.xml' },
    { name: 'Cricbuzz', url: 'https://www.cricbuzz.com/rss/cricket' },
    { name: 'NDTV Sports Cricket', url: 'https://feeds.ndtv.com/sports-cricket' }
];

// ============ SYSTEM ROUTES ============

// 1. Server Status Check
app.get('/health', (req, res) => {
    res.json({ success: true, message: "Match Dham Backend is Live and Running!", timestamp: new Date().toISOString() });
});

// 2. Cricket News Endpoint
app.get('/api/cricket/news', async (req, res, next) => {
    try {
        const cachedNews = cache.get('cricket_news');
        if (cachedNews) return res.json({ success: true, source: 'cache', data: cachedNews });

        let allNews = [];
        for (const feed of RSS_FEEDS) {
            try {
                const parsedFeed = await parser.parseURL(feed.url);
                const items = parsedFeed.items.map(item => ({
                    title: item.title,
                    description: item.description || '',
                    link: item.link,
                    source: feed.name,
                    published: item.pubDate || new Date().toLocaleDateString(),
                    guid: item.guid || item.link
                }));
                allNews = [...allNews, ...items];
            } catch (err) {
                logger.warn(`Feed Error (${feed.name}): ${err.message}`);
            }
        }

        if (allNews.length === 0) {
            allNews = [{ title: 'Match Dham Live Updates', description: 'Cricket server is active.', link: '#', source: 'Match Dham' }];
        }
        
        cache.set('cricket_news', allNews);
        res.json({ success: true, source: 'network', count: allNews.length, data: allNews });
    } catch (error) {
        next(error);
    }
});

// ============ 🔥 DYNAMIC ROUTES CONNECTION (STRUCUTRE FIXED) ============

// 3. Cricket Routes (Live Scores, Matches, Players)
app.use('/api/cricket', require('./routes/cricket'));

// 4. Firebase Routes (Leaderboard, User Creation, Stats)
app.use('/api/firebase', require('./routes/firebase'));

// 5. Gemini AI Routes (Chat, Match Analysis)
app.use('/api/gemini', require('./routes/gemini'));

// ============ GLOBAL ERROR HANDLER ============
// Yeh aapki utils/errorHandler.js file ko automatically run karega
app.use(errorHandler);

// ============ START SERVER ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`
    ╔════════════════════════════════════════════════╗
    ║  🚀 MATCH DHAM BACKEND - STRUCTURE FIXED!       ║
    ║  ✅ News API RSS Feeds Connected               ║
    ║  ✅ routes/cricket.js Linked Perfectly         ║
    ║  ✅ routes/firebase.js Database Active         ║
    ║  ✅ routes/gemini.js AI Engine Ready           ║
    ║  📍 PORT: ${PORT}                               ║
    ╚════════════════════════════════════════════════╝
    `);
});

module.exports = app;
