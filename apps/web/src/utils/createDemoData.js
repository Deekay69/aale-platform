import { db } from '../db/schema';

export async function createDemoData() {
    // Clear existing data
    await db.learningEvents.clear();
    await db.students.clear(); // Clear students to ensure we have fresh demo users

    // Create 3 demo students with different learning styles
    const aminaId = await db.students.add({
        name: 'Amina',
        gradeLevel: 3,
        createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000 // 1 week ago
    });

    const kwameId = await db.students.add({
        name: 'Kwame',
        gradeLevel: 3,
        createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000
    });

    const zuriId = await db.students.add({
        name: 'Zuri',
        gradeLevel: 3,
        createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000
    });

    // Get lessons
    const lessons = await db.lessons.toArray();

    // Amina: Visual learner (high scores on visual lessons)
    for (let i = 0; i < 5; i++) {
        const lesson = lessons[i];
        await db.learningEvents.add({
            studentId: aminaId,
            lessonId: lesson.id,
            score: lesson.contentType === 'visual' ? 95 : 65,
            timeSpent: 120 + Math.random() * 60,
            attempts: lesson.contentType === 'visual' ? 1 : 2,
            completedAt: Date.now() - (5 - i) * 24 * 60 * 60 * 1000,
            synced: false,
            contentType: lesson.contentType
        });
    }

    // Kwame: Text learner (high scores on text lessons)
    for (let i = 0; i < 4; i++) {
        const lesson = lessons[i];
        await db.learningEvents.add({
            studentId: kwameId,
            lessonId: lesson.id,
            score: lesson.contentType === 'text' ? 90 : 60,
            timeSpent: 100 + Math.random() * 50,
            attempts: lesson.contentType === 'text' ? 1 : 3,
            completedAt: Date.now() - (4 - i) * 24 * 60 * 60 * 1000,
            synced: false,
            contentType: lesson.contentType
        });
    }

    // Zuri: Struggling student
    for (let i = 0; i < 3; i++) {
        const lesson = lessons[i];
        await db.learningEvents.add({
            studentId: zuriId,
            lessonId: lesson.id,
            score: 45 + Math.random() * 20,
            timeSpent: 200 + Math.random() * 100,
            attempts: 3 + Math.floor(Math.random() * 3),
            completedAt: Date.now() - (3 - i) * 24 * 60 * 60 * 1000,
            synced: false,
            contentType: lesson.contentType
        });
    }

    console.log('✅ Demo data created!');
    return { aminaId, kwameId, zuriId };
}
