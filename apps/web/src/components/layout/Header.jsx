import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { SyncService } from '../../services/SyncService';

export default function Header() {
    const [syncStatus, setSyncStatus] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        checkSyncStatus();

        // Check sync status every 30 seconds
        const interval = setInterval(checkSyncStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    async function checkSyncStatus() {
        const syncService = new SyncService();
        const status = await syncService.getSyncStatus();
        setSyncStatus(status);
    }

    async function handleSync() {
        setIsSyncing(true);
        const syncService = new SyncService();
        await syncService.syncAll();
        await checkSyncStatus();
        setIsSyncing(false);
    }

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            zIndex: 100
        }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    SOMA
                </h1>
            </Link>

            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/dashboard" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                    Dashboard
                </Link>
                <Link to="/teacher" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                    Teacher View
                </Link>

                {syncStatus && (
                    <button
                        onClick={handleSync}
                        disabled={isSyncing || !navigator.onLine}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: syncStatus.unsynced > 0 ? '#fef3c7' : '#dcfce7',
                            color: syncStatus.unsynced > 0 ? '#92400e' : '#166534',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            cursor: navigator.onLine && !isSyncing ? 'pointer' : 'not-allowed',
                            opacity: !navigator.onLine ? 0.5 : 1
                        }}
                    >
                        <RefreshCw
                            size={16}
                            style={{
                                animation: isSyncing ? 'spin 1s linear infinite' : 'none'
                            }}
                        />
                        {isSyncing ? 'Syncing...' :
                            syncStatus.unsynced > 0 ? `${syncStatus.unsynced} pending` :
                                'All synced'}
                    </button>
                )}
            </nav>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </header>
    );
}
