/**
 * Gemini AI API Routes
 * Handles chat responses and quiz generation
 * Gemini API key is kept safe on backend
 */

const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger');
const { validateMessage } = require('../utils/validators');

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// ========== GEMINI ENDPOINTS ==========

/**
 * POST /api/gemini/chat
 * Send message to Gemini AI for response
 * Body: { message: "user message" }
 */
router.post('/chat', async (req, res, next) => {
  try {
    const { message } = req.body;

    // Validate input
    const validation = validateMessage(message);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    logger.info('Gemini Chat Request:', message.substring(0, 50) + '...');

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: message
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      },
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract response text
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    res.json({
      success: true,
      message: message,
      response: responseText,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Gemini Chat Error:', error.message);
    next(error);
  }
});

/**
 * POST /api/gemini/quiz
 * Generate cricket quiz questions
 * Body: { topic: "cricket topic", difficulty: "easy|medium|hard" }
 */
router.post('/quiz', async (req, res, next) => {
  try {
    const { topic = 'cricket', difficulty = 'medium', count = 5 } = req.body;

    logger.info(`Generating ${count} quiz questions on ${topic}`);

    const prompt = `Generate ${count} multiple choice cricket quiz questions about "${topic}" with difficulty level "${difficulty}". 
    Format each question as JSON with fields: question, options (array of 4), correctAnswer (index 0-3), explanation.
    Return ONLY valid JSON array, no other text.`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2000
        }
      },
      {
        timeout: 15000
      }
    );

    let questions = [];
    try {
      const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
      questions = JSON.parse(responseText);
    } catch (parseError) {
      logger.error('JSON Parse Error:', parseError.message);
      questions = [];
    }

    res.json({
      success: true,
      topic,
      difficulty,
      count: questions.length,
      questions: questions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Quiz Generation Error:', error.message);
    next(error);
  }
});

/**
 * POST /api/gemini/match-analysis
 * Get AI analysis of a cricket match
 * Body: { matchDetails: {...} }
 */
router.post('/match-analysis', async (req, res, next) => {
  try {
    const { matchDetails } = req.body;

    if (!matchDetails) {
      return res.status(400).json({ error: 'Match details are required' });
    }

    logger.info('Analyzing match with Gemini AI');

    const prompt = `Analyze this cricket match and provide insights:
    ${JSON.stringify(matchDetails)}
    
    Provide analysis in JSON format with: summary, keyMoments, playerHighlights, prediction`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500
        }
      },
      {
        timeout: 15000
      }
    );

    const analysis = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Match Analysis Error:', error.message);
    next(error);
  }
});

module.exports = router;
