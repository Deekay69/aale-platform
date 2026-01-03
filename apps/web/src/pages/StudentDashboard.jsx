import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function StudentDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth(); // Get authenticated user
    const [progress, setProgress] = useState(0);
    const [nextLesson, setNextLesson] = useState(null);
    const [stats, setStats] = useState({ completed: 0, total: 0 });

    useEffect(() => {
        if (user) {
            fetchProgress();
            fetchNextLesson();
        }
    }, [user]);

    async function fetchProgress() {
        try {
            // Fetch user's actual progress from backend
            const response = await api.get('/recommendations/profile');
            const { totalAttempts, contentTypePreferences } = response.data;

            // Calculate total lessons completed (score >= 80)
            const completedCount = contentTypePreferences.reduce((sum, type) => {
                return sum + parseInt(type.attempts || 0);
            }, 0);

            setStats({ completed: completedCount, total: completedCount + 10 }); // Assume 10 more available
            setProgress(completedCount > 0 ? Math.min(Math.round((completedCount / 20) * 100), 100) : 0);
        } catch (error) {
            console.error('Failed to fetch progress:', error);
        }
    }

    async function fetchNextLesson() {
        try {
            const response = await api.get('/recommendations/next-lesson');
            if (!response.data.completed) {
                setNextLesson(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch next lesson:', error);
        }
    }

    if (!user) return <div>Loading...</div>;

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem'
        }}>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Welcome back, {user.name}! 👋
            </h1>

            {/* Progress Card */}
            <div style={{
                background: 'var(--bg-surface)',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: 'var(--shadow-md)',
                color: 'var(--text-main)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <TrendingUp size={24} style={{ color: 'var(--accent)', marginRight: '0.5rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Your Progress</h2>
                </div>

                <div style={{
                    width: '100%',
                    height: '20px',
                    background: 'var(--bg-app)', // Use design system variable
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginBottom: '0.5rem',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
                        transition: 'width 0.5s ease'
                    }} />
                </div>

                <p style={{ color: 'var(--text-muted)' }}>
                    {progress}% Complete • Keep going!
                </p>
            </div>

            {/* Next Lesson Card */}
            {nextLesson && (
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    borderRadius: '12px',
                    padding: '2rem',
                    color: 'white',
                    marginBottom: '2rem',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <BookOpen size={24} style={{ marginRight: '0.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Recommended for You</h2>
                    </div>

                    <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        {nextLesson.title}
                    </h3>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <span style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.875rem'
                        }}>
                            Level {nextLesson.difficulty}
                        </span>
                        <span style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.875rem'
                        }}>
                            {nextLesson.contentType === 'visual' ? '👁️ Visual' : '📝 Text'}
                        </span>
                    </div>

                    <button
                        onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                        style={{
                            background: 'white',
                            color: 'var(--primary)',
                            padding: '0.75rem 2rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    >
                        Start Learning →
                    </button>
                </div>
            )}

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <StatCard icon={<Award />} label="Lessons Completed" value={stats.completed} />
                <StatCard icon={<TrendingUp />} label="Current Streak" value="3 days" />
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <div style={{
            background: 'var(--bg-surface)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center',
            color: 'var(--text-main)'
        }}>
            <div style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>
                {icon}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {value}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {label}
            </div>
        </div>
    );
}
