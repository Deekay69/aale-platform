import Dexie from 'dexie';

export const db = new Dexie('AALEDatabase');

db.version(1).stores({
    students: '++id, name, gradeLevel, createdAt, lastSynced',
    lessons: '++id, title, subject, difficulty, contentType, contentData',
    learningEvents: '++id, studentId, lessonId, score, timeSpent, attempts, completedAt, synced',
    recommendations: '++id, studentId, lessonId, confidence, reason, createdAt',
    syncQueue: '++id, type, payload, timestamp, synced'
});

// Seed data function
export async function seedDatabase() {
    const lessonCount = await db.lessons.count();

    if (lessonCount > 0) {
        console.log('Database already seeded');
        return;
    }

    // Seed 15 math lessons
    const lessons = [
        {
            title: 'Basic Addition',
            subject: 'math',
            difficulty: 1,
            contentType: 'visual',
            contentData: JSON.stringify({
                type: 'multiple_choice',
                question: 'What is 3 + 5?',
                visualAid: '🍎🍎🍎 + 🍎🍎🍎🍎🍎',
                options: ['6', '7', '8', '9'],
                correctAnswer: '8',
                explanation: 'When you add 3 items to 5 items, you get 8 items total.'
            })
        },
        {
            title: 'Subtraction Basics',
            subject: 'math',
            difficulty: 1,
            contentType: 'text',
            contentData: JSON.stringify({
                type: 'fill_in_blank',
                question: 'If you have 10 mangoes and eat 3, how many are left?',
                correctAnswer: '7',
                explanation: '10 - 3 = 7'
            })
        },
        {
            title: 'Multiplication Introduction',
            subject: 'math',
            difficulty: 2,
            contentType: 'visual',
            contentData: JSON.stringify({
                type: 'multiple_choice',
                question: 'What is 4 × 3?',
                visualAid: '🟦🟦🟦🟦\n🟦🟦🟦🟦\n🟦🟦🟦🟦',
                options: ['7', '10', '12', '15'],
                correctAnswer: '12',
                explanation: 'Four groups of three equals twelve: 3 + 3 + 3 + 3 = 12'
            })
        },
        {
            title: 'Simple Division',
            subject: 'math',
            difficulty: 2,
            contentType: 'text',
            contentData: JSON.stringify({
                type: 'multiple_choice',
                question: 'Divide 20 by 5',
                options: ['2', '3', '4', '5'],
                correctAnswer: '4',
                explanation: '20 divided by 5 is 4'
            })
        },
        {
            title: 'Shapes: Triangle',
            subject: 'math',
            difficulty: 1,
            contentType: 'visual',
            contentData: JSON.stringify({
                type: 'multiple_choice',
                question: 'How many sides does a triangle have?',
                visualAid: '🔺',
                options: ['2', '3', '4', '5'],
                correctAnswer: '3',
                explanation: 'A triangle has three sides.'
            })
        },
        {
            title: 'Counting to 100',
            subject: 'math',
            difficulty: 1,
            contentType: 'text',
            contentData: JSON.stringify({
                type: 'fill_in_blank',
                question: 'What number comes after 99?',
                correctAnswer: '100',
                explanation: 'The number after 99 is 100.'
            })
        },
        {
            title: 'Even and Odd',
            subject: 'math',
            difficulty: 2,
            contentType: 'text',
            contentData: JSON.stringify({
                type: 'multiple_choice',
                question: 'Which number is even?',
                options: ['3', '5', '7', '8'],
                correctAnswer: '8',
                explanation: 'Even numbers end in 0, 2, 4, 6, or 8.'
            })
        },
        {
            title: 'Fractions',
            subject: 'math',
            difficulty: 3,
            contentType: 'visual',
            contentData: JSON.stringify({
                type: 'multiple_choice',
                question: 'What is 1/2 of 10?',
                options: ['2', '5', '8', '20'],
                correctAnswer: '5',
                explanation: 'Half of 10 is 5.'
            })
        },
        {
            title: 'Time Telling',
            subject: 'math',
            difficulty: 2,
            contentType: 'visual',
            contentData: JSON.stringify({
                type: 'multiple_choice',
                question: 'How many minutes are in an hour?',
                options: ['30', '60', '90', '100'],
                correctAnswer: '60',
                explanation: 'There are 60 minutes in one hour.'
            })
        },
        {
            title: 'Measurement',
            subject: 'math',
            difficulty: 2,
            contentType: 'text',
            contentData: JSON.stringify({
                type: 'fill_in_blank',
                question: 'How many cm in 1 meter?',
                correctAnswer: '100',
                explanation: '1 meter equals 100 centimeters.'
            })
        },
        // Adding placeholders to reach 15 as suggested
        ...Array.from({ length: 5 }).map((_, i) => ({
            title: `Math Practice ${i + 11}`,
            subject: 'math',
            difficulty: 1,
            contentType: 'text',
            contentData: JSON.stringify({
                type: 'multiple_choice',
                question: `What is ${i + 1} + ${i + 1}?`,
                options: [`${(i + 1) * 2}`, `${(i + 1) * 2 + 1}`, `${(i + 1) * 2 - 1}`, '0'],
                correctAnswer: `${(i + 1) * 2}`,
                explanation: 'Simple addition.'
            })
        }))
    ];

    await db.lessons.bulkAdd(lessons);
    console.log('Database seeded with', lessons.length, 'lessons');
}
