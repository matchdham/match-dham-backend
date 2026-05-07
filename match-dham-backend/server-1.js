/**
 * Match Dham - Production-Ready Backend Server
 * Handles all API calls securely from backend
 * All sensitive keys are hidden from frontend
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

// ========== SECURITY MIDDLEWARE ==========

// Helmet - Set security HTTP headers
app.use(helmet());

// Compression - Gzip compression for better performance
app.use(compression());

// CORS - Allow requests from your frontend only
app.use(cors({
  origin: [
    'https://match-dham.netlify.app',
    'https://a59.netlify.app',
    'http://localhost:3000' // For local testing
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting - Prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ========== LOGGING MIDDLEWARE ==========

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ========== API ROUTES ==========

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Backend running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Cricket API routes
app.use('/api/cricket', cricketRoutes);

// Gemini AI routes
app.use('/api/gemini', geminiRoutes);

// Firebase routes
app.use('/api/firebase', firebaseRoutes);

// ========== ERROR HANDLING ==========

// 404 - Not Found
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use(errorHandler);

// ========== SERVER STARTUP ==========

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🚀 Match Dham Backend running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV || 'production'}`);
  logger.info(`🔐 All API keys are secure and hidden from frontend`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;
