const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Receive learning events from client
router.post('/events', authenticateToken, async (req, res) => {
    try {
        const { events } = req.body;

        if (!Array.isArray(events) || events.length === 0) {
            return res.status(400).json({ error: 'Events array required' });
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            let inserted = 0;
            let updated = 0;

            for (const event of events) {
                // Check if event already exists (idempotency)
                const existing = await client.query(
                    'SELECT id FROM learning_events WHERE id = $1',
                    [event.id]
                );

                if (existing.rows.length > 0) {
                    // Update existing (in case of conflict resolution)
                    await client.query(
                        `UPDATE learning_events 
             SET score = $1, time_spent = $2, attempts = $3, completed_at = $4
             WHERE id = $5`,
                        [event.score, event.timeSpent, event.attempts,
                        new Date(event.completedAt), event.id]
                    );
                    updated++;
                } else {
                    // Insert new
                    await client.query(
                        `INSERT INTO learning_events 
             (id, student_id, lesson_id, score, time_spent, attempts, completed_at, device_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [event.id, req.user.id, event.lessonId, event.score,
                        event.timeSpent, event.attempts, new Date(event.completedAt),
                        event.deviceId || 'web']
                    );
                    inserted++;
                }
            }

            await client.query('COMMIT');
            res.json({
                success: true,
                inserted,
                updated,
                total: inserted + updated
            });

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

// Get sync status (what needs syncing)
router.get('/status', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT COUNT(*) as total_events, 
              MAX(synced_at) as last_sync
       FROM learning_events 
       WHERE student_id = $1`,
            [req.user.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Status error:', error);
        res.status(500).json({ error: 'Failed to get status' });
    }
});

module.exports = router;
