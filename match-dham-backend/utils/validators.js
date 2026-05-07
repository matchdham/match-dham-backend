/**
 * Input Validators
 * Validates user input to prevent injection and invalid data
 */

/**
 * Validate message for chat
 */
function validateMessage(message) {
  if (!message) {
    return { valid: false, error: 'Message is required' };
  }

  if (typeof message !== 'string') {
    return { valid: false, error: 'Message must be a string' };
  }

  if (message.length < 1) {
    return { valid: false, error: 'Message is too short' };
  }

  if (message.length > 5000) {
    return { valid: false, error: 'Message is too long (max 5000 characters)' };
  }

  return { valid: true };
}

/**
 * Validate user ID
 */
function validateUserId(userId) {
  if (!userId) {
    return { valid: false, error: 'User ID is required' };
  }

  if (typeof userId !== 'string') {
    return { valid: false, error: 'User ID must be a string' };
  }

  if (userId.length < 3) {
    return { valid: false, error: 'User ID is too short' };
  }

  if (userId.length > 50) {
    return { valid: false, error: 'User ID is too long' };
  }

  // Allow alphanumeric and underscore only
  if (!/^[a-zA-Z0-9_-]+$/.test(userId)) {
    return { valid: false, error: 'User ID contains invalid characters' };
  }

  return { valid: true };
}

/**
 * Validate score
 */
function validateScore(score) {
  if (score === null || score === undefined) {
    return { valid: false, error: 'Score is required' };
  }

  if (typeof score !== 'number') {
    return { valid: false, error: 'Score must be a number' };
  }

  if (score < 0) {
    return { valid: false, error: 'Score cannot be negative' };
  }

  if (score > 999999) {
    return { valid: false, error: 'Score is too high' };
  }

  return { valid: true };
}

/**
 * Validate email
 */
function validateEmail(email) {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

/**
 * Validate username
 */
function validateUsername(username) {
  if (!username) {
    return { valid: false, error: 'Username is required' };
  }

  if (typeof username !== 'string') {
    return { valid: false, error: 'Username must be a string' };
  }

  if (username.length < 3) {
    return { valid: false, error: 'Username is too short (min 3 characters)' };
  }

  if (username.length > 30) {
    return { valid: false, error: 'Username is too long (max 30 characters)' };
  }

  // Allow alphanumeric, underscore, hyphen
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Username contains invalid characters' };
  }

  return { valid: true };
}

/**
 * Sanitize string input
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  
  return str
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

module.exports = {
  validateMessage,
  validateUserId,
  validateScore,
  validateEmail,
  validateUsername,
  sanitizeString
};
