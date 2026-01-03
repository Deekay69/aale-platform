/**
 * AI-Powered Comprehensive Content Generator for AALE
 * Generates rich, CBC-aligned educational content using Google Gemini API
 * Based on advanced lesson structure with learning styles and cultural context
 */

const pool = require('../config/database');

// Learning Styles
const LEARNING_STYLES = ['visual', 'auditory', 'kinesthetic', 'mixed'];

// Kenyan Competency-Based Curriculum (CBC) structure
const CBC_CURRICULUM = {
    grade3: {
        Math: [
            { topic: 'Numbers and Place Value (0-1000)', concepts: ['counting', 'ordering', 'place value', 'comparing numbers'] },
            { topic: 'Addition and Subtraction within 1000', concepts: ['mental math', 'word problems', 'estimation', 'regrouping'] },
            { topic: 'Multiplication Tables (2, 3, 4, 5, 10)', concepts: ['repeated addition', 'arrays', 'patterns', 'skip counting'] },
            { topic: 'Division and Fair Sharing', concepts: ['equal groups', 'sharing', 'remainders', 'division facts'] },
            { topic: 'Fractions for Beginners', concepts: ['halves', 'thirds', 'quarters', 'comparing fractions'] },
            { topic: 'Kenyan Money and Transactions', concepts: ['coins', 'notes', 'making change', 'budgeting', 'saving'] },
            { topic: 'Time and Calendars', concepts: ['analog clocks', 'digital time', 'days', 'weeks', 'months', 'years'] },
            { topic: 'Measurement in Daily Life', concepts: ['length', 'weight', 'capacity', 'comparing', 'estimating'] },
            { topic: 'Shapes Around Us', concepts: ['2D shapes', '3D shapes', 'properties', 'symmetry', 'patterns'] }
        ],
        Science: [
            { topic: 'Living Things in Our Environment', concepts: ['characteristics of life', 'classification', 'habitats'] },
            { topic: 'Plants We See and Use', concepts: ['parts of plants', 'growth', 'photosynthesis basics', 'uses'] },
            { topic: 'Kenyan Animals and Their Homes', concepts: ['wild animals', 'domestic animals', 'food chains', 'conservation'] },
            { topic: 'Our Amazing Bodies', concepts: ['body parts', 'five senses', 'nutrition', 'hygiene', 'exercise'] },
            { topic: 'Matter All Around Us', concepts: ['solid', 'liquid', 'gas', 'changes of state', 'mixing'] },
            { topic: 'Weather and Seasons in Kenya', concepts: ['types of weather', 'measuring weather', 'climate zones', 'rainy seasons'] },
            { topic: 'Soil and Farming', concepts: ['types of soil', 'soil uses', 'conservation', 'farming in Kenya'] },
            { topic: 'Water - Our Precious Resource', concepts: ['water sources', 'water cycle', 'conservation', 'clean water'] }
        ],
        English: [
            { topic: 'Phonics and Word Building', concepts: ['consonant blends', 'digraphs', 'vowel sounds', 'syllables'] },
            { topic: 'Reading Kenyan Stories', concepts: ['main idea', 'details', 'characters', 'plot', 'moral lessons'] },
            { topic: 'Nouns in Our Language', concepts: ['common nouns', 'proper nouns', 'singular', 'plural', 'possessive'] },
            { topic: 'Action Words (Verbs)', concepts: ['present tense', 'past tense', 'future tense', 'action identification'] },
            { topic: 'Describing Words (Adjectives)', concepts: ['descriptive adjectives', 'comparison', 'sensory words'] },
            { topic: 'Building Good Sentences', concepts: ['subject', 'predicate', 'capital letters', 'full stops', 'questions'] },
            { topic: 'Punctuation Marks', concepts: ['period', 'question mark', 'exclamation', 'comma', 'apostrophe'] },
            { topic: 'Growing Our Vocabulary', concepts: ['synonyms', 'antonyms', 'context clues', 'compound words'] }
        ],
        'Social Studies': [
            { topic: 'Our County in Kenya', concepts: ['47 counties', 'county features', 'county government', 'resources'] },
            { topic: 'Family and Community', concepts: ['family structure', 'roles', 'traditions', 'celebrations', 'respect'] },
            { topic: 'Being a Good Citizen', concepts: ['rights', 'responsibilities', 'patriotism', 'national values'] },
            { topic: 'How We Travel and Communicate', concepts: ['transport types', 'communication methods', 'safety', 'technology'] },
            { topic: 'Kenyan National Symbols', concepts: ['flag', 'coat of arms', 'national anthem', 'public seal'] },
            { topic: 'Work and Economic Activities', concepts: ['farming', 'trading', 'services', 'industries', 'markets'] }
        ]
    }
};

/**
 * Create comprehensive prompt for Gemini
 */
function createComprehensiveLessonPrompt(subject, topicData, difficulty, learningStyle) {
    return `Act as an expert Kenyan Curriculum (CBC) Specialist for AALE (African-Adaptive Learning Environment).

Task: Create a comprehensive, offline-ready lesson that will engage Kenyan Grade ${difficulty} students.

LESSON SPECIFICATIONS:
- Topic: ${topicData.topic}
- Subject: ${subject}
- Grade Level: ${difficulty}
- Primary Learning Style: ${learningStyle}
- Key Concepts: ${topicData.concepts.join(', ')}

CULTURAL REQUIREMENTS:
1. Use authentic Kenyan names (Wanjiku, Ochieng, Kipchoge, Amina, etc.)
2. Reference Kenyan places (Nairobi, Mombasa, Nakuru, Kisumu, etc.)
3. Use Kenyan Shillings (KES) for money examples
4. Include local foods (ugali, chapati, sukuma wiki, mandazi, etc.)
5. Reference local transport (matatu, boda boda, tuk-tuk, etc.)
6. Incorporate Swahili words where natural (jambo, asante, rafiki, etc.)

LEARNING STYLE ADAPTATION FOR ${learningStyle.toUpperCase()}:
${getLearningStyleGuidance(learningStyle)}

CBC COMPETENCIES TO ADDRESS:
- Communication and Collaboration
- Critical Thinking and Problem Solving
- Citizenship
- Digital Literacy (where applicable)
- Self-Efficacy

Return a comprehensive lesson in JSON format with the following structure:
{
  "title": "Engaging, descriptive title (max 60 characters)",
  "objectives": ["List 3-4 specific learning objectives students will achieve"],
  "introduction": "Hook students with a relatable Kenyan scenario (2-3 sentences)",
  "mainBody": "Core lesson content explaining the concept clearly with Kenyan examples (4-6 sentences)",
  "culturalContext": "How this topic relates to daily Kenyan life and traditions (2-3 sentences)",
  "cbcRelevance": "Which CBC competencies this develops and how (2 sentences)",
  "practicalActivity": "Hands-on activity students can do without internet or expensive materials (3-4 sentences with clear steps)",
  "quiz": [
    {
      "question": "Multiple choice question testing understanding",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct with encouragement"
    },
    // Include 3-5 quiz questions of varying difficulty
  ]
}`;
}

/**
 * Learning style guidance
 */
function getLearningStyleGuidance(style) {
    const guidance = {
        visual: `- Use vivid visual descriptions (colors, shapes, arrangements)
- Include diagrams/charts references in explanations
- Main activity should involve drawing, charts, or visual organization
- Questions should reference visual scenarios`,

        auditory: `- Use rhythmic language, rhymes, or songs where appropriate
- Include dialogue and storytelling elements
- Main activity should involve reciting, discussing, or explaining aloud
- Reference sounds in examples (marketplace noise, animal sounds, etc.)`,

        kinesthetic: `- Emphasize movement and physical interaction
- Main activity MUST be hands-on (building, sorting, measuring, acting)
- Use action verbs throughout
- Questions should reference physical experiences`,

        mixed: `- Balance visual, auditory, and kinesthetic elements
- Provide multiple ways to engage with content
- Activity should allow student choice in approach`
    };

    return guidance[style] || guidance.mixed;
}

/**
 * Generate lesson with AI using structured schema
 */
async function generateComprehensiveLesson(subject, topicData, difficulty) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: 'gemini-pro',
        generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
        }
    });

    // Randomly select learning style for diversity
    const learningStyle = LEARNING_STYLES[Math.floor(Math.random() * LEARNING_STYLES.length)];

    const prompt = createComprehensiveLessonPrompt(subject, topicData, difficulty, learningStyle);

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown code blocks if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const lessonData = JSON.parse(text);

        // Validate required fields
        if (!lessonData.title || !lessonData.quiz || !Array.isArray(lessonData.quiz)) {
            throw new Error('Invalid lesson structure from AI');
        }

        return {
            title: lessonData.title,
            subject,
            difficulty,
            learning_style: learningStyle,
            content_type: learningStyle === 'visual' ? 'visual' : learningStyle === 'auditory' ? 'text' : 'mixed',
            content_data: {
                // Comprehensive lesson structure
                objectives: lessonData.objectives || [],
                introduction: lessonData.introduction || '',
                mainBody: lessonData.mainBody || '',
                culturalContext: lessonData.culturalContext || '',
                cbcRelevance: lessonData.cbcRelevance || '',
                practicalActivity: lessonData.practicalActivity || '',

                // Quiz data (main assessment)
                quiz: lessonData.quiz.map(q => ({
                    question: q.question,
                    options: q.options,
                    correct: q.correctAnswer,
                    explanation: q.explanation
                })),

                // Primary quiz question (for backward compatibility)
                question: lessonData.quiz[0].question,
                options: lessonData.quiz[0].options,
                correct: lessonData.quiz[0].correctAnswer,
                explanation: lessonData.quiz[0].explanation,

                // Metadata
                topic: topicData.topic,
                concepts: topicData.concepts,
                learningStyle: learningStyle,
                generatedAt: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error(`Failed to generate lesson for ${subject} - ${topicData.topic}:`, error.message);
        return null;
    }
}

/**
 * Generate batch of comprehensive lessons
 */
async function generateLessonBatch(count = 20) {
    console.log(`🤖 Starting Comprehensive AI Lesson Generation`);
    console.log(`📚 Target: ${count} CBC-aligned lessons with full structure\n`);

    const lessons = [];
    const curriculum = CBC_CURRICULUM.grade3;
    const subjects = Object.keys(curriculum);
    let generated = 0;

    for (const subject of subjects) {
        const topics = curriculum[subject];
        const lessonsPerSubject = Math.ceil(count / subjects.length);

        for (let i = 0; i < Math.min(lessonsPerSubject, topics.length); i++) {
            if (generated >= count) break;

            const topic = topics[i];
            console.log(`\n[${generated + 1}/${count}] Generating: ${subject} - ${topic.topic}...`);

            const lesson = await generateComprehensiveLesson(subject, topic, 3);

            if (lesson) {
                lessons.push(lesson);
                generated++;
                console.log(`✓ Created: "${lesson.title}" (${lesson.learning_style} style)`);
                console.log(`  Objectives: ${lesson.content_data.objectives.length}, Quiz: ${lesson.content_data.quiz.length} questions`);

                // Rate limiting: 1.5 seconds between requests to avoid quota issues
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }

        if (generated >= count) break;
    }

    return lessons;
}

/**
 * Save to database
 */
async function saveLessonsToDatabase(lessons) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (const lesson of lessons) {
            await client.query(
                `INSERT INTO lessons (title, subject, difficulty, content_type, content_data)
         VALUES ($1, $2, $3, $4, $5)`,
                [
                    lesson.title,
                    lesson.subject,
                    lesson.difficulty,
                    lesson.content_type,
                    JSON.stringify(lesson.content_data)
                ]
            );
        }

        await client.query('COMMIT');
        console.log(`\n✅ Saved ${lessons.length} comprehensive lessons to database`);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Main execution
 */
async function main() {
    try {
        const targetCount = parseInt(process.argv[2]) || 20;

        console.log('🇰🇪 AALE Comprehensive AI Content Generator');
        console.log('━'.repeat(60));
        console.log(`📝 Generating ${targetCount} full-structure CBC lessons\n`);

        const lessons = await generateLessonBatch(targetCount);

        if (lessons.length > 0) {
            await saveLessonsToDatabase(lessons);

            console.log('\n📊 Generation Summary:');
            const summary = {};
            const styleStats = {};

            lessons.forEach(l => {
                summary[l.subject] = (summary[l.subject] || 0) + 1;
                styleStats[l.learning_style] = (styleStats[l.learning_style] || 0) + 1;
            });

            console.log('\nBy Subject:');
            console.table(summary);
            console.log('\nBy Learning Style:');
            console.table(styleStats);

            const avgQuizSize = lessons.reduce((sum, l) => sum + l.content_data.quiz.length, 0) / lessons.length;
            console.log(`\n📝 Average quiz questions per lesson: ${avgQuizSize.toFixed(1)}`);
        } else {
            console.log('❌ No lessons generated. Check your GEMINI_API_KEY.');
        }

    } catch (error) {
        console.error('❌ Generation failed:', error.message);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { generateComprehensiveLesson, CBC_CURRICULUM };
