/**
 * ========================================================
 * 🚀 MATCH DHAM BACKEND - MAIN SERVER.JS (SMART PATH FIXED)
 * ========================================================
 * Authorized by: Aryan Raj Dham
 * Managed by: Dham Manager Sahiba
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const Parser = require('rss-parser');
const NodeCache = require('node-cache');
const fs = require('fs');
const path = require('path');

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // 1 Hour Cache

// ============ MIDDLEWARES & SECURITY ============
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

app.use(cors({
    origin: ['https:/matchdham.netlify.app/', 'http://localhost:3000', 'http://localhost:5000'],
    credentials: true
}));
app.use(helmet({
    contentSecurityPolicy: false // Data block hone se bachane ke liye
}));
app.use(compression());

// ============ SYSTEM HEALTH CHECK ============
app.get('/health', (req, res) => {
    res.json({ success: true, message: "Match Dham Backend is Live and Running!", timestamp: new Date().toISOString() });
});

// ============ RSS FEED FOR NEWS ============
const parser = new Parser({
    customFields: { item: ['description', 'link', 'pubDate'] }
});

const RSS_FEEDS = [
    { name: 'ESPNcricinfo', url: 'https://www.espncricinfo.com/feeds/rss/cricket_news.xml' },
    { name: 'Cricbuzz', url: 'https://www.cricbuzz.com/rss/cricket' },
    { name: 'NDTV Sports Cricket', url: 'https://feeds.ndtv.com/sports-cricket' }
];

app.get('/api/cricket/news', async (req, res) => {
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
                    published: item.pubDate || new Date().toLocaleDateString()
                }));
                allNews = [...allNews, ...items];
            } catch (err) {
                console.log(`Feed Error (${feed.name}):`, err.message);
            }
        }

        if (allNews.length === 0) {
            allNews = [{ title: 'Match Dham Live Updates', description: 'Cricket server is active.', link: '#', source: 'Match Dham' }];
        }
        
        cache.set('cricket_news', allNews);
        res.json({ success: true, source: 'network', data: allNews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ 🔥 SMART ROUTER CONNECTION (AUTO-PATH FINDER) ============
// यह लॉजिक खुद ही ढूंढेगा कि आपकी क्रिकेट फाइल किस फोल्डर में है ताकि 500 Error न आए
let cricketRouter;

const pathsToTest = [
    path.join(__dirname, 'routes', 'cricket.js'),
    path.join(__dirname, 'Routes', 'cricket.js'),
    path.join(__dirname, 'cricket.js')
];

if (fs.existsSync(pathsToTest[0])) {
    cricketRouter = require('./routes/cricket');
    console.log("✅ Loaded from: ./routes/cricket.js");
} else if (fs.existsSync(pathsToTest[1])) {
    cricketRouter = require('./Routes/cricket');
    console.log("✅ Loaded from: ./Routes/cricket.js");
} else if (fs.existsSync(pathsToTest[2])) {
    cricketRouter = require('./cricket');
    console.log("✅ Loaded from: ./cricket.js");
}

// Routes को एक्सप्रेस के साथ जोड़ना
if (cricketRouter) {
    app.use('/api/cricket', cricketRouter);
} else {
    // Fallback: अगर फाइल नहीं मिली तो सर्वर क्रैश नहीं होगा, बल्कि स्क्रीन पर एरर बताएगा
    app.use('/api/cricket', (req, res) => {
        res.status(404).json({ 
            success: false, 
            error: "cricket.js file backend par kisi bhi sahi jagah nahi mili! Kripya apna folder check karein." 
        });
    });
}

// ============ START SERVER ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 MATCH DHAM SERVER ACTIVE ON PORT: ${PORT}`);
});

module.exports = app;

