/**
 * Kenyanizer Engine - AI Content Localizer
 * Transforms generic educational content into Kenyan CBC-aligned context.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function kenyanize(rawContent, subject, difficulty) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-pro',
    generationConfig: { temperature: 0.7 }
  });

  const prompt = `Act as a Kenyan CBC (Competency-Based Curriculum) Specialist.
  Take the following raw educational content and "Kenyanize" it for a Grade ${difficulty} student.

  RAW CONTENT:
  ${JSON.stringify(rawContent)}

  RULES:
  1. Names: Change all names to common Kenyan names (e.g. Moraa, Juma, Zawadi).
  2. Currency: Change all currencies to Kenyan Shillings (KES).
  3. Context: Change scenarios to Kenyan daily life (e.g. markets, matatus, tea farms, local wildlife).
  4. Language: Use Kenyan English and sprinkle natural Swahili where appropriate (e.g. "Duka", "Shamba").
  5. Alignment: Ensure objectives align with CBC competencies like Citizenship or Critical Thinking.

  OUTPUT FORMAT:
  Strictly follow the AALE Lesson Schema:
  {
    "title": "Descriptive title",
    "objectives": ["array of 3 objectives"],
    "introduction": "Scenatio-based hook",
    "mainBody": "Core content explanation",
    "culturalContext": "Local relevance",
    "cbcRelevance": "CBC competency mapping",
    "practicalActivity": "Hands-on activity using local materials",
    "quiz": [
      {
        "question": "Question text",
        "options": ["Op A", "Op B", "Op C", "Op D"],
        "correctAnswer": 0,
        "explanation": "Why it is correct"
      }
    ]
  }
  
  ONLY return the JSON. No preamble.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Cleanup markdown
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Localization Error:', error.message);
    return null;
  }
}

module.exports = { kenyanize };
