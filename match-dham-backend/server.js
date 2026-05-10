/**
 * Match Dham - Final Vercel Backend (No app.listen)
 * Optimized with Rate Limit fix for Vercel
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Import routes
const cricketRoutes = require('./routes/cricket');
const geminiRoutes = require('./routes/gemini');
const firebaseRoutes = require('./routes/firebase');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Initialize express app
const app = express();

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    'https://match-dham.netlify.app',
    'https://a59.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting - Fixed for Vercel 'X-Forwarded-For' Error
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  validate: { xForwardedForHeader: false } // यह लाइन उस लाल एरर को खत्म कर देगी
});
app.use('/api/', limiter);

// API Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Backend is Live on Vercel!',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/cricket', cricketRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/firebase', firebaseRoutes);

// Error Handling
app.use(errorHandler);

// Export for Vercel
module.exports = app;

