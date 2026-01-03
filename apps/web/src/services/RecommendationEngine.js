import { db } from '../db/schema';

export class RecommendationEngine {
    constructor() {
        this.epsilon = 0.2; // 20% exploration rate
    }

    async getNextLesson(studentId) {
        // Get student's learning history
        const learningEvents = await db.learningEvents
            .where('studentId')
            .equals(studentId)
            .toArray();

        // Analyze performance by content type
        const performanceByType = this.analyzePerformance(learningEvents);

        // Get all lessons
        const allLessons = await db.lessons.toArray();

        // Filter out completed lessons (score >= 80%)
        const completedLessonIds = learningEvents
            .filter(e => e.score >= 80)
            .map(e => e.lessonId);

        const availableLessons = allLessons.filter(
            l => !completedLessonIds.includes(l.id)
        );

        if (availableLessons.length === 0) {
            return null; // All lessons completed!
        }

        // Epsilon-greedy selection
        if (Math.random() < this.epsilon) {
            // EXPLORE: Random lesson
            const randomIndex = Math.floor(Math.random() * availableLessons.length);
            return availableLessons[randomIndex];
        } else {
            // EXPLOIT: Choose lesson matching student's preferred content type
            const preferredType = this.getPreferredContentType(performanceByType);

            const matchingLessons = availableLessons.filter(
                l => l.contentType === preferredType
            );

            if (matchingLessons.length > 0) {
                // Return easiest lesson first (build confidence)
                return matchingLessons.sort((a, b) => a.difficulty - b.difficulty)[0];
            }

            // Fallback: return next available lesson
            return availableLessons.sort((a, b) => a.difficulty - b.difficulty)[0];
        }
    }

    analyzePerformance(events) {
        const typeScores = new Map();

        events.forEach(event => {
            // We need to get the lesson to know its content type
            // In a real implementation, you'd join this data
            // For now, we'll store it when creating the event
            const type = event.contentType || 'mixed';

            if (!typeScores.has(type)) {
                typeScores.set(type, []);
            }
            typeScores.get(type).push(event.score);
        });

        // Calculate average score per type
        const avgScores = new Map();
        typeScores.forEach((scores, type) => {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            avgScores.set(type, avg);
        });

        return avgScores;
    }

    getPreferredContentType(performance) {
        if (performance.size === 0) {
            return 'mixed'; // No data yet
        }

        let bestType = 'mixed';
        let bestScore = 0;

        performance.forEach((score, type) => {
            if (score > bestScore) {
                bestScore = score;
                bestType = type;
            }
        });

        return bestType;
    }

    async createRecommendation(studentId, lesson) {
        const performance = await this.analyzePerformance(
            await db.learningEvents.where('studentId').equals(studentId).toArray()
        );

        const preferredType = this.getPreferredContentType(performance);

        const reason = lesson.contentType === preferredType
            ? `This ${lesson.contentType} lesson matches your learning style`
            : `Trying a different approach to help you learn better`;

        await db.recommendations.add({
            studentId,
            lessonId: lesson.id,
            confidence: lesson.contentType === preferredType ? 0.8 : 0.5,
            reason,
            createdAt: Date.now()
        });
    }
}
