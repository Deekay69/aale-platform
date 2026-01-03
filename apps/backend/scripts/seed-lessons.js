const pool = require('../config/database');

const sampleLessons = [
    {
        title: "Adding Single Digits",
        subject: "Math",
        difficulty: 1,
        content_type: "visual",
        content: JSON.stringify({
            question: "What is 3 + 4?",
            options: ["5", "6", "7", "8"],
            correct: 2,
            explanation: "When you add 3 and 4, you get 7!"
        })
    },
    {
        title: "Counting Objects",
        subject: "Math",
        difficulty: 1,
        content_type: "visual",
        content: JSON.stringify({
            question: "How many apples are there? 🍎🍎🍎🍎🍎",
            options: ["3", "4", "5", "6"],
            correct: 2,
            explanation: "Count them carefully: 1, 2, 3, 4, 5!"
        })
    },
    {
        title: "Subtraction Basics",
        subject: "Math",
        difficulty: 1,
        content_type: "text",
        content: JSON.stringify({
            question: "If you have 8 candies and eat 3, how many are left?",
            options: ["4", "5", "6", "7"],
            correct: 1,
            explanation: "8 - 3 = 5 candies remaining"
        })
    },
    {
        title: "Animal Sounds",
        subject: "Science",
        difficulty: 1,
        content_type: "visual",
        content: JSON.stringify({
            question: "What sound does a cow make?",
            options: ["Meow", "Woof", "Moo", "Quack"],
            correct: 2,
            explanation: "Cows say 'Moo'! 🐄"
        })
    },
    {
        title: "Shapes Recognition",
        subject: "Math",
        difficulty: 2,
        content_type: "visual",
        content: JSON.stringify({
            question: "How many sides does a triangle have?",
            options: ["2", "3", "4", "5"],
            correct: 1,
            explanation: "A triangle has 3 sides!"
        })
    },
    {
        title: "Days of the Week",
        subject: "General Knowledge",
        difficulty: 2,
        content_type: "text",
        content: JSON.stringify({
            question: "What day comes after Wednesday?",
            options: ["Tuesday", "Thursday", "Friday", "Saturday"],
            correct: 1,
            explanation: "Thursday comes after Wednesday"
        })
    },
    {
        title: "Simple Multiplication",
        subject: "Math",
        difficulty: 2,
        content_type: "mixed",
        content: JSON.stringify({
            question: "What is 2 × 3?",
            options: ["4", "5", "6", "7"],
            correct: 2,
            explanation: "2 groups of 3 make 6"
        })
    },
    {
        title: "Colors in Swahili",
        subject: "Language",
        difficulty: 2,
        content_type: "visual",
        content: JSON.stringify({
            question: "What is 'red' in Swahili?",
            options: ["Nyekundu", "Bluu", "Kijani", "Njano"],
            correct: 0,
            explanation: "Nyekundu means red in Swahili! 🔴"
        })
    },
    {
        title: "Fraction Basics",
        subject: "Math",
        difficulty: 3,
        content_type: "visual",
        content: JSON.stringify({
            question: "What is 1/2 of 10?",
            options: ["3", "4", "5", "6"],
            correct: 2,
            explanation: "Half of 10 is 5"
        })
    },
    {
        title: "Plants Need",
        subject: "Science",
        difficulty: 3,
        content_type: "text",
        content: JSON.stringify({
            question: "What do plants need to grow?",
            options: ["Only water", "Only sunlight", "Water, sunlight, and air", "Only soil"],
            correct: 2,
            explanation: "Plants need water, sunlight, and air to grow healthy and strong! 🌱"
        })
    }
];

async function seedLessons() {
    const client = await pool.connect();

    try {
        console.log('🌱 Starting lesson seed...');

        // Check if lessons already exist
        const existing = await client.query('SELECT COUNT(*) FROM lessons');
        if (parseInt(existing.rows[0].count) > 0) {
            console.log(`⚠️  Database already has ${existing.rows[0].count} lessons. Skipping seed.`);
            console.log('   To re-seed, run: DELETE FROM lessons; in your database first.');
            return;
        }

        await client.query('BEGIN');

        for (const lesson of sampleLessons) {
            await client.query(
                `INSERT INTO lessons (title, subject, difficulty, content_type, content_data, version, prerequisites)
         VALUES ($1, $2, $3, $4, $5, 1, '[]')`,
                [lesson.title, lesson.subject, lesson.difficulty, lesson.content_type, lesson.content]
            );
        }

        await client.query('COMMIT');
        console.log(`✅ Successfully seeded ${sampleLessons.length} lessons!`);

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Seed failed:', error);
        throw error;
    } finally {
        client.release();
        process.exit(0);
    }
}

seedLessons();
