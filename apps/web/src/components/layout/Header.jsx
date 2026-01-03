import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, LogOut, User } from 'lucide-react';
import { SyncService } from '../../services/SyncService';
import { useAuth } from '../../context/AuthContext';


export default function Header() {
    const [syncStatus, setSyncStatus] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

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
                {user ? (
                    <>
                        <Link to="/dashboard" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                            Dashboard
                        </Link>
                        {user.role === 'teacher' && (
                            <Link to="/teacher" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                                Teacher View
                            </Link>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user.name}</span>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>

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
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>
                            Sign in
                        </Link>
                        <Link to="/register" style={{
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 500
                        }}>
                            Get Started
                        </Link>
                    </>
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
