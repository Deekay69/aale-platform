import { db } from '../db/schema';
import toast from 'react-hot-toast';

export class SyncService {
    constructor() {
        this.apiUrl = 'https://your-backend-api.com/sync'; // Replace with actual backend
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

            // Send to server (mock for now)
            const response = await this.mockSync(payload);

            if (response.success) {
                // Mark events as synced
                await db.learningEvents.bulkUpdate(
                    unsyncedEvents.map(e => ({ key: e.id, changes: { synced: true } }))
                );

                toast.dismiss();
                toast.success(`✅ Synced ${unsyncedEvents.length} events!`);

                this.isSyncing = false;
                return { success: true, synced: unsyncedEvents.length };
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

    // Mock sync for demo (replace with real API call)
    async mockSync(payload) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Mock sync successful:', payload);
                resolve({ success: true });
            }, 1500);
        });
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
