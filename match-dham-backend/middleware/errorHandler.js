/**
 * Global Error Handler Middleware
 * Catches and handles all errors in the application
 */

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err.message);

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle different error types
  if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'External service unavailable';
  } else if (err.code === 'ENOTFOUND') {
    statusCode = 503;
    message = 'Service not found';
  } else if (err.code === 'ETIMEDOUT') {
    statusCode = 504;
    message = 'Request timeout';
  } else if (err.response?.status) {
    // Axios error with response
    statusCode = err.response.status;
    message = err.response.data?.error || message;
  } else if (err instanceof SyntaxError) {
    statusCode = 400;
    message = 'Invalid JSON format';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { details: err.stack })
  });
};

module.exports = errorHandler;
