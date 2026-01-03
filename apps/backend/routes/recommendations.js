const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Multi-Armed Bandit Recommendation Engine
class MABEngine {
    constructor(epsilon = 0.2) {
        this.epsilon = epsilon; // 20% exploration rate
    }

    async getNextLesson(studentId) {
        const client = await pool.connect();

        try {
            // Get student's learning history
            const history = await client.query(
                `SELECT le.*, l.content_type, l.difficulty 
         FROM learning_events le
         JOIN lessons l ON le.lesson_id = l.id
         WHERE le.student_id = $1
         ORDER BY le.completed_at DESC
         LIMIT 50`,
                [studentId]
            );

            // Analyze performance by content type
            const performance = this.analyzePerformance(history.rows);

            // Get all available lessons
            // Logic: Lessons the student hasn't mastered yet (score < 80)
            const allLessons = await client.query(
                `SELECT l.* FROM lessons l
         WHERE l.id NOT IN (
           SELECT lesson_id FROM learning_events 
           WHERE student_id = $1 AND score >= 80
         )
         ORDER BY l.difficulty ASC`,
                [studentId]
            );

            if (allLessons.rows.length === 0) {
                return null; // All lessons completed!
            }

            // Epsilon-greedy selection
            let selectedLesson;

            if (Math.random() < this.epsilon) {
                // EXPLORE: Random lesson from those remaining
                const randomIndex = Math.floor(Math.random() * allLessons.rows.length);
                selectedLesson = allLessons.rows[randomIndex];
            } else {
                // EXPLOIT: Best performing content type
                const preferredType = this.getPreferredType(performance);
                const matchingLessons = allLessons.rows.filter(
                    l => l.content_type === preferredType
                );

                if (matchingLessons.length > 0) {
                    // Select the easiest lesson in the preferred category
                    selectedLesson = matchingLessons[0];
                } else {
                    // Fallback if no matching lessons for preferred type
                    selectedLesson = allLessons.rows[0];
                }
            }

            // Log recommendation for future analysis
            await client.query(
                `INSERT INTO recommendations (student_id, lesson_id, confidence, reason)
         VALUES ($1, $2, $3, $4)`,
                [
                    studentId,
                    selectedLesson.id,
                    selectedLesson.content_type === this.getPreferredType(performance) ? 0.8 : 0.5,
                    `Engine state: ${JSON.stringify(performance)}`
                ]
            );

            return selectedLesson;

        } finally {
            client.release();
        }
    }

    analyzePerformance(history) {
        const typeStats = {};

        history.forEach(event => {
            if (!typeStats[event.content_type]) {
                typeStats[event.content_type] = { scores: [], count: 0 };
            }
            typeStats[event.content_type].scores.push(event.score);
            typeStats[event.content_type].count++;
        });

        // Calculate average scores per content type
        Object.keys(typeStats).forEach(type => {
            const avg = typeStats[type].scores.reduce((a, b) => a + b, 0) / typeStats[type].count;
            typeStats[type].avgScore = avg;
        });

        return typeStats;
    }

    getPreferredType(performance) {
        let best = { type: 'mixed', score: 0 };

        Object.entries(performance).forEach(([type, stats]) => {
            if (stats.avgScore > best.score) {
                best = { type, score: stats.avgScore };
            }
        });

        return best.type;
    }
}

// API endpoint
router.get('/next-lesson', authenticateToken, async (req, res) => {
    try {
        const studentId = req.user.id;
        const engine = new MABEngine();
        let nextLesson = await engine.getNextLesson(studentId);

        // --- NEW: Review Mode Logic ---
        if (!nextLesson) {
            // If all lessons are mastered, find the one with the lowest score for review
            const reviewResult = await pool.query(
                `SELECT l.*, le.score 
                 FROM lessons l
                 JOIN learning_events le ON l.id = le.lesson_id
                 WHERE le.student_id = $1
                 ORDER BY le.score ASC, le.completed_at ASC
                 LIMIT 1`,
                [studentId]
            );

            if (reviewResult.rows.length > 0) {
                return res.json({
                    ...reviewResult.rows[0],
                    isReview: true,
                    message: "Course complete! Let's review some key concepts."
                });
            }

            return res.json({
                message: 'All lessons completed! Great job!',
                completed: true
            });
        }

        res.json(nextLesson);
    } catch (error) {
        console.error('Recommendation error:', error);
        res.status(500).json({ error: 'Failed to get recommendation' });
    }
});

// Get student's learning profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
        l.content_type,
        COUNT(*) as attempts,
        AVG(le.score) as avg_score,
        AVG(le.time_spent) as avg_time
       FROM learning_events le
       JOIN lessons l ON le.lesson_id = l.id
       WHERE le.student_id = $1
       GROUP BY l.content_type`,
            [req.user.id]
        );

        res.json({
            contentTypePreferences: result.rows,
            totalAttempts: result.rows.reduce((sum, r) => sum + parseInt(r.attempts), 0)
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Failed to get profile data' });
    }
});

module.exports = router;
