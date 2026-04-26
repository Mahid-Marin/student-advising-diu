/**
 * AI Service for Knowledge Base
 * Handles integration with AI APIs (Groq via Python backend)
 */

import axios from 'axios';
import { getCachedResponse, cacheResponse } from './localstorageService';

// Python API for AI services (Groq integration)
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000';
// Java API for other services
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance for AI API calls (Python backend)
const aiClient = axios.create({
  baseURL: AI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generate AI explanation for knowledge base content
 * Checks cache first, then calls API if not cached
 * @param {number} itemId - Knowledge base item ID
 * @param {string} content - Content to explain
 * @param {string} title - Item title for context
 * @returns {Promise<string>} AI-generated explanation
 */
export const generateExplanation = async (itemId, content, title) => {
  try {
    // Check cache first
    const cached = getCachedResponse(itemId);
    if (cached) {
      return cached;
    }

    // Prepare the prompt
    const prompt = `You are an academic assistant helping students understand important information. 
Explain the following clearly and concisely for a student in 2-3 paragraphs:

Topic: ${title}

Content:
${content}

Provide a clear, student-friendly explanation that highlights the key points and why this matters for their academic success.`;

    // Call the Python AI API (with Groq integration)
    const response = await aiClient.post('/ai/explain', {
      content,
      title,
      prompt,
    });

    const explanation = response.data.explanation || response.data.message;

    // Cache the response
    cacheResponse(itemId, explanation);

    return explanation;
  } catch (error) {
    console.error('AI API error:', error);
    // Return a fallback response if API fails
    return `Unable to generate AI explanation at the moment. Please try again later. Meanwhile, here's the original content: ${content}`;
  }
};

/**
 * Send a follow-up question about a knowledge base item
 * @param {number} itemId - Knowledge base item ID
 * @param {string} question - User's follow-up question
 * @param {string} content - Original content
 * @param {string} title - Item title
 * @returns {Promise<string>} AI-generated answer
 */
export const askFollowUp = async (itemId, question, content, title) => {
  try {
    const prompt = `You are an academic assistant. A student has asked a follow-up question about this topic:

Topic: ${title}
Original Content: ${content}

Student's Question: ${question}

Please answer their question clearly and concisely, relating it back to the original content.`;

    const response = await aiClient.post('/ai/explain', {
      content,
      title,
      prompt,
      question,
    });

    return response.data.explanation || response.data.message;
  } catch (error) {
    console.error('AI API error:', error);
    return 'Unable to answer your question at the moment. Please try again later.';
  }
};

/**
 * Verify if AI API is available
 * @returns {Promise<boolean>} True if API is accessible
 */
export const checkAIAvailability = async () => {
  try {
    const response = await aiClient.get('/ai/health');
    return response.status === 200;
  } catch (error) {
    console.warn('AI API not available:', error);
    return false;
  }
};

/**
 * Generate a summary of multiple knowledge base items
 * @param {Array} items - Array of knowledge base items
 * @returns {Promise<string>} AI-generated summary
 */
export const generateSummary = async (items) => {
  try {
    const contents = items.map(item => `${item.title}: ${item.content}`).join('\n\n');

    const prompt = `You are an academic advisor. Please provide a brief, helpful summary of these academic policies and information:

${contents}

Focus on what students need to know and why it matters.`;

    const response = await aiClient.post('/ai/explain', {
      content: contents,
      title: 'Academic Information Summary',
      prompt,
    });

    return response.data.explanation || response.data.message;
  } catch (error) {
    console.error('AI API error:', error);
    return 'Unable to generate summary at the moment.';
  }
};
