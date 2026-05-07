/**
 * Logger Utility
 * Handles all logging for the backend
 */

const logLevel = process.env.LOG_LEVEL || 'info';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const colors = {
  error: '\x1b[31m',    // Red
  warn: '\x1b[33m',     // Yellow
  info: '\x1b[36m',     // Cyan
  debug: '\x1b[35m',    // Magenta
  reset: '\x1b[0m'      // Reset
};

function log(level, message, data = '') {
  if (levels[level] > levels[logLevel]) {
    return;
  }

  const timestamp = new Date().toISOString();
  const color = colors[level];
  const reset = colors.reset;
  
  const formattedMessage = `${color}[${timestamp}] [${level.toUpperCase()}]${reset} ${message}`;
  
  if (data) {
    console.log(formattedMessage, data);
  } else {
    console.log(formattedMessage);
  }
}

const logger = {
  error: (message, data) => log('error', message, data),
  warn: (message, data) => log('warn', message, data),
  info: (message, data) => log('info', message, data),
  debug: (message, data) => log('debug', message, data)
};

module.exports = logger;
