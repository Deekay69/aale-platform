const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get classroom heatmap
router.get('/classroom/:classroomId/heatmap',
    authenticateToken,
    requireRole('teacher'),
    async (req, res) => {
        try {
            const { classroomId } = req.params;

            // Verify teacher owns this classroom
            const classroom = await pool.query(
                'SELECT * FROM classrooms WHERE id = $1 AND teacher_id = $2',
                [classroomId, req.user.id]
            );

            if (classroom.rows.length === 0) {
                return res.status(403).json({ error: 'Access denied' });
            }

            // Get performance data
            const heatmap = await pool.query(
                `SELECT 
          l.id as lesson_id,
          l.title,
          l.difficulty,
          COUNT(le.id) as student_count,
          AVG(le.score) as avg_score,
          AVG(le.attempts) as avg_attempts,
          AVG(le.time_spent) as avg_time
        FROM lessons l
        LEFT JOIN learning_events le ON l.id = le.lesson_id
        LEFT JOIN classroom_students cs ON le.student_id = cs.student_id
        WHERE cs.classroom_id = $1
        GROUP BY l.id, l.title, l.difficulty
        ORDER BY avg_score ASC NULLS LAST`,
                [classroomId]
            );

            res.json(heatmap.rows);
        } catch (error) {
            console.error('Heatmap error:', error);
            res.status(500).json({ error: 'Failed to get heatmap' });
        }
    });

module.exports = router;
