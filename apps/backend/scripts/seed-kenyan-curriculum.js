const pool = require('../config/database');

/**
 * AI-Powered Lesson Generator
 * Uses OpenAI/Gemini to create rich, curriculum-aligned lessons
 */

// For now, we'll use a simpler approach: generate via Gemini/Claude prompts
// You can replace this with actual API calls to OpenAI, Anthropic, or Google AI

const lessonTemplates = [
    {
        grade: 3,
        subject: "Math",
        topics: [
            "Addition and Subtraction within 1000",
            "Multiplication basics (2, 5, 10 times tables)",
            "Division concepts",
            "Fractions (halves, thirds, quarters)",
            "Money and currency (Kenyan Shillings)",
            "Time telling (hours and minutes)",
            "Shapes and geometry",
            "Measurement (length, weight, volume)"
        ]
    },
    {
        grade: 3,
        subject: "English",
        topics: [
            "Phonics and word formation",
            "Reading comprehension",
            "Nouns, verbs, adjectives",
            "Sentence structure",
            "Punctuation marks",
            "Vocabulary building",
            "Story writing basics"
        ]
    },
    {
        grade: 3,
        subject: "Science",
        topics: [
            "Living and non-living things",
            "Parts of plants",
            "Animal habitats",
            "Weather and seasons",
            "States of matter (solid, liquid, gas)",
            "The human body",
            "Food groups and nutrition",
            "Safety and hygiene"
        ]
    },
    {
        grade: 3,
        subject: "Social Studies",
        topics: [
            "Kenyan counties and map reading",
            "Community helpers",
            "Family and traditions",
            "Kenyan symbols (flag, anthem)",
            "Transport and communication",
            "Good citizenship"
        ]
    }
];

/**
 * Generate a lesson using AI prompt
 * This is a TEMPLATE - you need to add actual API integration
 */
function generateLessonPrompt(subject, topic, difficulty) {
    return `Create an educational quiz question for Grade ${difficulty} students in Kenya.

Subject: ${subject}
Topic: ${topic}

Requirements:
1. The question should be culturally relevant to East African students
2. Use simple, clear language appropriate for the grade level
3. Include 4 multiple choice options (A, B, C, D)
4. One correct answer
5. A brief, encouraging explanation

Return ONLY a JSON object in this exact format:
{
  "question": "The question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Why this answer is correct"
}`;
}

/**
 * Manual high-quality lessons based on Kenyan curriculum
 */
const kenyanCurriculumLessons = [
    // GRADE 3 MATH
    {
        title: "Kenyan Currency - Counting Shillings",
        subject: "Math",
        difficulty: 3,
        content_type: "visual",
        content_data: {
            question: "Mama Jane bought sukuma wiki for 20 shillings and tomatoes for 30 shillings. How much did she spend?",
            options: ["40 shillings", "50 shillings", "60 shillings", "70 shillings"],
            correct: 1,
            explanation: "20 + 30 = 50 shillings. Great job counting money!"
        }
    },
    {
        title: "Multiplication - Matatu Seats",
        subject: "Math",
        difficulty: 3,
        content_type: "mixed",
        content_data: {
            question: "A matatu has 4 rows of seats. Each row has 3 seats. How many seats in total?",
            options: ["7 seats", "10 seats", "12 seats", "15 seats"],
            correct: 2,
            explanation: "4 rows × 3 seats = 12 seats. This is multiplication!"
        }
    },
    {
        title: "Time - School Schedule",
        subject: "Math",
        difficulty: 3,
        content_type: "visual",
        content_data: {
            question: "School starts at 8:00 AM and ends at 3:00 PM. How many hours is the school day?",
            options: ["5 hours", "6 hours", "7 hours", "8 hours"],
            correct: 2,
            explanation: "From 8 AM to 3 PM is 7 hours. Count carefully!"
        }
    },

    // GRADE 3 SCIENCE
    {
        title: "Kenyan Wildlife - Animal Habitats",
        subject: "Science",
        difficulty: 3,
        content_type: "visual",
        content_data: {
            question: "Where do fish like tilapia live?",
            options: ["In trees", "In water", "Underground", "In the sky"],
            correct: 1,
            explanation: "Tilapia and other fish live in water - rivers, lakes, and oceans! 🐟"
        }
    },
    {
        title: "Plants We Eat - Kenyan Foods",
        subject: "Science",
        difficulty: 3,
        content_type: "mixed",
        content_data: {
            question: "Which part of the maize plant do we eat?",
            options: ["The roots", "The leaves", "The seeds (grains)", "The stem"],
            correct: 2,
            explanation: "We eat the maize seeds/grains! They're ground into flour for ugali. 🌽"
        }
    },
    {
        title: "Weather in Kenya",
        subject: "Science",
        difficulty: 3,
        content_type: "text",
        content_data: {
            question: "What happens to puddles when the sun is very hot?",
            options: ["They freeze", "They evaporate (dry up)", "They get bigger", "They turn green"],
            correct: 1,
            explanation: "The sun's heat makes water evaporate - it turns into water vapor in the air!"
        }
    },

    // GRADE 3 ENGLISH
    {
        title: "Swahili-English Words",
        subject: "English",
        difficulty: 3,
        content_type: "text",
        content_data: {
            question: "What is the plural of 'book'?",
            options: ["book", "books", "bookes", "book's"],
            correct: 1,
            explanation: "We add 's' to make most words plural. One book, two books!"
        }
    },
    {
        title: "Punctuation - Kenyan Names",
        subject: "English",
        difficulty: 3,
        content_type: "text",
        content_data: {
            question: "Which sentence is written correctly?",
            options: [
                "my friend wanjiru is from nairobi",
                "My friend Wanjiru is from Nairobi.",
                "my Friend wanjiru is From nairobi",
                "My Friend Wanjiru Is From Nairobi"
            ],
            correct: 1,
            explanation: "Names of people and places start with capital letters. Sentences end with a period!"
        }
    },

    // SOCIAL STUDIES
    {
        title: "Kenyan Counties",
        subject: "Social Studies",
        difficulty: 3,
        content_type: "visual",
        content_data: {
            question: "Which county is the capital city Nairobi in?",
            options: ["Mombasa County", "Nairobi County", "Kisumu County", "Nakuru County"],
            correct: 1,
            explanation: "Nairobi is both a city AND a county! It's Kenya's capital. 🇰🇪"
        }
    },
    {
        title: "Community Helpers",
        subject: "Social Studies",
        difficulty: 3,
        content_type: "mixed",
        content_data: {
            question: "Who helps us when we are sick?",
            options: ["Teacher", "Doctor or Nurse", "Engineer", "Artist"],
            correct: 1,
            explanation: "Doctors and nurses help us stay healthy and treat us when we're sick!"
        }
    }
];

async function seedKenyanLessons() {
    const client = await pool.connect();

    try {
        console.log('🇰🇪 Starting Kenyan curriculum lessons seed...\n');

        // Check existing lessons
        const existing = await client.query('SELECT COUNT(*) FROM lessons');
        const count = parseInt(existing.rows[0].count);

        if (count > 0) {
            console.log(`⚠️  Found ${count} existing lessons in database.`);
            console.log('   This script will ADD new lessons without deleting old ones.\n');
        }

        await client.query('BEGIN');

        let inserted = 0;
        for (const lesson of kenyanCurriculumLessons) {
            await client.query(
                `INSERT INTO lessons (title, subject, difficulty, content_type, content_data, version, prerequisites)
         VALUES ($1, $2, $3, $4, $5, 1, '[]')`,
                [
                    lesson.title,
                    lesson.subject,
                    lesson.difficulty,
                    lesson.content_type,
                    JSON.stringify(lesson.content_data)
                ]
            );
            inserted++;
            console.log(`✓ Added: ${lesson.title} (${lesson.subject}, Level ${lesson.difficulty})`);
        }

        await client.query('COMMIT');

        console.log(`\n✅ Successfully added ${inserted} Kenyan curriculum lessons!`);
        console.log('\n📊 Summary:');
        const summary = await client.query(
            `SELECT subject, difficulty, COUNT(*) as count 
       FROM lessons 
       GROUP BY subject, difficulty 
       ORDER BY subject, difficulty`
        );
        console.table(summary.rows);

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Seed failed:', error);
        throw error;
    } finally {
        client.release();
        process.exit(0);
    }
}

// Auto-run if called directly
if (require.main === module) {
    seedKenyanLessons();
}

module.exports = { kenyanCurriculumLessons, lessonTemplates };
