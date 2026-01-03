import { db } from '../db/schema';

export class AnalyticsService {
    async getClassroomHeatmap() {
        // Get all learning events
        const events = await db.learningEvents.toArray();

        // Group by lesson
        const lessonPerformance = new Map();

        for (const event of events) {
            const lesson = await db.lessons.get(event.lessonId);

            if (!lessonPerformance.has(event.lessonId)) {
                lessonPerformance.set(event.lessonId, {
                    lesson,
                    scores: [],
                    attempts: [],
                    timeSpent: []
                });
            }

            const data = lessonPerformance.get(event.lessonId);
            data.scores.push(event.score);
            data.attempts.push(event.attempts);
            data.timeSpent.push(event.timeSpent);
        }

        // Calculate averages and determine status
        const heatmapData = [];

        lessonPerformance.forEach((data, lessonId) => {
            const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
            const avgAttempts = data.attempts.reduce((a, b) => a + b, 0) / data.attempts.length;
            const avgTime = data.timeSpent.reduce((a, b) => a + b, 0) / data.timeSpent.length;

            let status = 'mastered';
            if (avgScore < 60) status = 'struggle';
            else if (avgScore < 80) status = 'developing';

            heatmapData.push({
                lesson: data.lesson,
                avgScore: Math.round(avgScore),
                avgAttempts: Math.round(avgAttempts * 10) / 10,
                avgTime: Math.round(avgTime),
                studentCount: data.scores.length,
                status
            });
        });
        // Sort by avg score (struggles first)
        return heatmapData.sort((a, b) => a.avgScore - b.avgScore);
    }

    async getOverallStats() {
        const events = await db.learningEvents.toArray();
        const students = await db.students.toArray();
        const lessons = await db.lessons.toArray();
        const completedLessons = events.filter(e => e.score >= 80).length;
        const avgScore = events.length > 0
            ? Math.round(events.reduce((sum, e) => sum + e.score, 0) / events.length)
            : 0;

        return {
            totalStudents: students.length,
            totalLessons: lessons.length,
            completedLessons,
            avgScore,
            strugglingTopics: 0 // Will be calculated from heatmap
        };
    }
}
