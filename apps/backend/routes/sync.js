const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Receive learning events from client (Legacy/Web)
router.post('/events', authenticateToken, async (req, res) => {
    try {
        const { events } = req.body;
        const studentId = req.user.id;

        if (!Array.isArray(events) || events.length === 0) {
            return res.status(400).json({ error: 'Events array required' });
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            let inserted = 0;
            let updated = 0;

            for (const event of events) {
                // IMPORTANT: Filter by student_id to ensure isolation
                const existing = await client.query(
                    'SELECT id FROM learning_events WHERE id = $1 AND student_id = $2',
                    [event.id, studentId]
                );

                if (existing.rows.length > 0) {
                    await client.query(
                        `UPDATE learning_events 
                         SET score = $1, time_spent = $2, attempts = $3, completed_at = $4
                         WHERE id = $5 AND student_id = $6`,
                        [event.score, event.timeSpent, event.attempts,
                        new Date(event.completedAt), event.id, studentId]
                    );
                    updated++;
                } else {
                    await client.query(
                        `INSERT INTO learning_events 
                         (id, student_id, lesson_id, score, time_spent, attempts, completed_at, device_id)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [event.id, studentId, event.lessonId, event.score,
                        event.timeSpent, event.attempts, new Date(event.completedAt),
                        event.deviceId || 'web']
                    );
                    inserted++;
                }
            }

            await client.query('COMMIT');
            res.json({ success: true, inserted, updated });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ error: 'Sync failed' });
    }
});

// WatermelonDB Pull Changes
router.get('/pull', authenticateToken, async (req, res) => {
    try {
        const { last_pulled_at } = req.query;
        const studentId = req.user.id;
        const lastPulledAt = last_pulled_at ? new Date(parseInt(last_pulled_at)) : new Date(0);

        const lessons = await pool.query(
            'SELECT * FROM lessons WHERE updated_at > $1',
            [lastPulledAt]
        );

        const events = await pool.query(
            'SELECT * FROM learning_events WHERE student_id = $1 AND updated_at > $2',
            [studentId, lastPulledAt]
        );

        res.json({
            changes: {
                lessons: {
                    created: lessons.rows.filter(l => l.created_at > lastPulledAt),
                    updated: lessons.rows.filter(l => l.created_at <= lastPulledAt),
                    deleted: [], // We don't delete lessons for now
                },
                learning_events: {
                    created: events.rows.filter(e => e.created_at > lastPulledAt),
                    updated: events.rows.filter(e => e.created_at <= lastPulledAt),
                    deleted: [],
                }
            },
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Pull error:', error);
        res.status(500).json({ error: 'Pull failed' });
    }
});

// WatermelonDB Push Changes
router.post('/push', authenticateToken, async (req, res) => {
    try {
        const { changes } = req.body;
        const studentId = req.user.id;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            if (changes.learning_events) {
                const { created, updated } = changes.learning_events;

                for (const row of [...created, ...updated]) {
                    await client.query(
                        `INSERT INTO learning_events 
                         (id, student_id, lesson_id, score, time_spent, attempts, completed_at)
                         VALUES ($1, $2, $3, $4, $5, $6, $7)
                         ON CONFLICT (id) DO UPDATE SET
                         score = EXCLUDED.score,
                         time_spent = EXCLUDED.time_spent,
                         attempts = EXCLUDED.attempts,
                         completed_at = EXCLUDED.completed_at
                         WHERE learning_events.student_id = $2`,
                        [row.id, studentId, row.lesson_id, row.score, row.time_spent, row.attempts, new Date(row.completed_at)]
                    );
                }
            }

            await client.query('COMMIT');
            res.status(200).json({ success: true });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Push error:', error);
        res.status(500).json({ error: 'Push failed' });
    }
});

module.exports = router;
