import { useState, useEffect } from 'react';
import { AnalyticsService } from '../services/AnalyticsService';
import { Users, BookOpen, TrendingUp, AlertTriangle } from 'lucide-react';

export default function TeacherDashboard() {
    const [heatmapData, setHeatmapData] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const analytics = new AnalyticsService();
        const heatmap = await analytics.getClassroomHeatmap();
        const overallStats = await analytics.getOverallStats();

        overallStats.strugglingTopics = heatmap.filter(d => d.status === 'struggle').length;

        setHeatmapData(heatmap);
        setStats(overallStats);
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'struggle': return '#ef4444';
            case 'developing': return '#f59e0b';
            case 'mastered': return '#10b981';
            default: return '#94a3b8';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'struggle': return '⚠️ Needs Attention';
            case 'developing': return '📈 In Progress';
            case 'mastered': return '✅ Mastered';
            default: return 'No Data';
        }
    };

    if (!stats) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Analytics...</div>;

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: 'var(--primary)' }}>
                Teacher Dashboard
            </h1>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <StatCard
                    icon={<Users size={24} />}
                    label="Total Students"
                    value={stats.totalStudents}
                    color="var(--primary)"
                />
                <StatCard
                    icon={<BookOpen size={24} />}
                    label="Lessons Completed"
                    value={stats.completedLessons}
                    color="var(--accent)"
                />
                <StatCard
                    icon={<TrendingUp size={24} />}
                    label="Average Score"
                    value={`${stats.avgScore}%`}
                    color="#10b981"
                />
                <StatCard
                    icon={<AlertTriangle size={24} />}
                    label="Topics Needing Help"
                    value={stats.strugglingTopics}
                    color="#ef4444"
                />
            </div>

            {/* Heatmap */}
            <div style={{
                background: 'var(--bg-surface)',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: 'var(--shadow-md)',
                color: 'var(--text-main)'
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                    Classroom Performance Heatmap
                </h2>

                {heatmapData.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                        No student data yet. Students will appear here once they start learning.
                    </p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {heatmapData.map((item) => (
                            <div
                                key={item.lesson.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1.5rem',
                                    borderRadius: '8px',
                                    border: '2px solid var(--border-color, #e2e8f0)',
                                    borderLeftWidth: '6px',
                                    borderLeftColor: getStatusColor(item.status),
                                    transition: 'transform 0.2s',
                                    background: 'var(--bg-app)'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        {item.lesson.title}
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        gap: '2rem',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-muted)'
                                    }}>
                                        <span>📊 Avg Score: <strong>{item.avgScore}%</strong></span>
                                        <span>👥 {item.studentCount} students</span>
                                        <span>🔄 Avg Attempts: <strong>{item.avgAttempts}</strong></span>
                                        <span>⏱️ Avg Time: <strong>{item.avgTime}s</strong></span>
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    background: `${getStatusColor(item.status)}20`,
                                    color: getStatusColor(item.status),
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }}>
                                    {getStatusLabel(item.status)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Insights */}
            {stats.strugglingTopics > 0 && (
                <div style={{
                    marginTop: '2rem',
                    background: '#fef2f2',
                    border: '2px solid #ef4444',
                    borderRadius: '12px',
                    padding: '1.5rem'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
                        ⚠️ Action Needed
                    </h3>
                    <p style={{ color: '#991b1b' }}>
                        {stats.strugglingTopics} topic{stats.strugglingTopics > 1 ? 's' : ''} need your attention.
                        Consider reviewing these lessons in class or providing additional practice materials.
                    </p>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    return (
        <div style={{
            background: 'var(--bg-surface)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: 'var(--text-main)'
        }}>
            <div style={{
                padding: '0.75rem',
                borderRadius: '12px',
                background: color.startsWith('#') ? `${color}15` : `var(--${color.replace('var(--', '').replace(')', '')}-light)`, // basic fallback for vars
                color: color
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    {label}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {value}
                </div>
            </div>
        </div>
    );
}
