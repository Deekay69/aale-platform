import { db } from '../db/schema';
import toast from 'react-hot-toast';
import api from './api';

export class SyncService {
    constructor() {
        this.isSyncing = false;
    }

    async syncAll() {
        if (this.isSyncing) {
            console.log('Sync already in progress');
            return;
        }

        if (!navigator.onLine) {
            toast.error('Cannot sync while offline');
            return;
        }

        this.isSyncing = true;
        toast.loading('Syncing your progress...');

        try {
            // Get unsynced learning events
            const unsyncedEvents = await db.learningEvents
                .where('synced')
                .equals(0) // 0 = false in Dexie
                .toArray();

            if (unsyncedEvents.length === 0) {
                toast.dismiss();
                toast.success('Everything is up to date!');
                this.isSyncing = false;
                return { success: true, synced: 0 };
            }

            // Prepare payload
            const payload = {
                events: unsyncedEvents.map(e => ({
                    id: e.id,
                    studentId: e.studentId,
                    lessonId: e.lessonId,
                    score: e.score,
                    timeSpent: e.timeSpent,
                    attempts: e.attempts,
                    completedAt: e.completedAt
                })),
                timestamp: Date.now()
            };

            // Send to server
            const response = await api.post('/api/sync/events', payload);

            if (response.data.success) {
                // Mark events as synced
                await db.learningEvents.bulkUpdate(
                    unsyncedEvents.map(e => ({ key: e.id, changes: { synced: 1 } })) // 1 = true in Dexie
                );

                toast.dismiss();
                toast.success(`✅ Synced ${response.data.total} events!`);

                this.isSyncing = false;
                return { success: true, synced: response.data.inserted };
            }

            throw new Error('Sync failed');

        } catch (error) {
            console.error('Sync error:', error);
            toast.dismiss();
            toast.error('Sync failed. Will retry later.');
            this.isSyncing = false;
            return { success: false, error: error.message };
        }
    }



    async getSyncStatus() {
        const unsyncedCount = await db.learningEvents
            .where('synced')
            .equals(0)
            .count();

        return {
            unsynced: unsyncedCount,
            status: unsyncedCount === 0 ? 'synced' : 'pending'
        };
    }
}
