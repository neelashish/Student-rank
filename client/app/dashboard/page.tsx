'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import ScoreLineChart from '../../components/ScoreLineChart';
import PlatformBarChart from '../../components/PlatformBarChart';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [summary, setSummary] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user, timeRange]);

    const fetchDashboardData = async () => {
        if (!user) return;

        try {
            const [summaryRes, historyRes] = await Promise.all([
                api.get('/analytics/summary'),
                api.get(`/analytics/history/${user.id}?days=${timeRange}`),
            ]);

            setSummary(summaryRes.data);
            setHistory(historyRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div style={styles.loading}>
                <div className="spinner"></div>
                <p style={styles.loadingText}>Loading dashboard...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div style={styles.container}>
            <div className="container">
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>📊 Dashboard</h1>
                        <p style={styles.subtitle}>Welcome back, {user.name}!</p>
                    </div>

                    <div style={styles.timeFilter}>
                        <button
                            className={timeRange === '7' ? 'btn btn-primary' : 'btn btn-secondary'}
                            onClick={() => setTimeRange('7')}
                            style={styles.filterBtn}
                        >
                            7 Days
                        </button>
                        <button
                            className={timeRange === '30' ? 'btn btn-primary' : 'btn btn-secondary'}
                            onClick={() => setTimeRange('30')}
                            style={styles.filterBtn}
                        >
                            30 Days
                        </button>
                        <button
                            className={timeRange === '90' ? 'btn btn-primary' : 'btn btn-secondary'}
                            onClick={() => setTimeRange('90')}
                            style={styles.filterBtn}
                        >
                            90 Days
                        </button>
                    </div>
                </div>

                {summary && (
                    <>
                        {/* Stats Grid */}
                        <div style={styles.statsGrid}>
                            <StatCard
                                icon="🏆"
                                label="Total Score"
                                value={summary.currentScore.toFixed(1)}
                                change={summary.scoreChange7Days}
                                color="#6366f1"
                            />
                            <StatCard
                                icon="🌍"
                                label="Global Rank"
                                value={`#${summary.globalRank}`}
                                color="#ec4899"
                            />
                            <StatCard
                                icon="🎓"
                                label="College Rank"
                                value={`#${summary.collegeRank}`}
                                color="#8b5cf6"
                            />
                            <StatCard
                                icon="👥"
                                label="Total Students"
                                value={summary.totalUsers.toLocaleString()}
                                color="#10b981"
                            />
                        </div>

                        {/* Charts */}
                        <div style={styles.chartsGrid}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                {history.length > 0 ? (
                                    <ScoreLineChart data={history} />
                                ) : (
                                    <div className="glass-card" style={styles.noData}>
                                        <p>📈 No history data yet. Sync your stats to see progress charts!</p>
                                    </div>
                                )}
                            </div>

                            {summary.platformStats && (
                                <PlatformBarChart
                                    githubScore={summary.platformStats.githubScore}
                                    leetcodeScore={summary.platformStats.leetcodeScore}
                                    hackerrankScore={summary.platformStats.hackerrankScore}
                                />
                            )}

                            <div className="glass-card" style={styles.quickStats}>
                                <h3 style={styles.sectionTitle}>Quick Stats</h3>
                                <div style={styles.statsList}>
                                    {summary.platformStats && (
                                        <>
                                            <div style={styles.statRow}>
                                                <span style={styles.statLabel}>⚡ GitHub Repos</span>
                                                <span style={styles.statValue}>{summary.platformStats.githubRepos}</span>
                                            </div>
                                            <div style={styles.statRow}>
                                                <span style={styles.statLabel}>⭐ GitHub Stars</span>
                                                <span style={styles.statValue}>{summary.platformStats.githubStars}</span>
                                            </div>
                                            <div style={styles.statRow}>
                                                <span style={styles.statLabel}>🎯 LeetCode Solved</span>
                                                <span style={styles.statValue}>{summary.platformStats.leetcodeSolved}</span>
                                            </div>
                                            <div style={styles.statRow}>
                                                <span style={styles.statLabel}>💎 HackerRank Stars</span>
                                                <span style={styles.statValue}>{summary.platformStats.hackerrankStars}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        padding: '60px 0',
        minHeight: 'calc(100vh - 80px)',
    },
    header: {
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '24px',
    },
    title: {
        fontSize: '48px',
        fontWeight: '800',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '18px',
        color: 'var(--text-secondary)',
    },
    timeFilter: {
        display: 'flex',
        gap: '8px',
    },
    filterBtn: {
        padding: '8px 16px',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
    },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
    },
    quickStats: {
        padding: '24px',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '20px',
    },
    statsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    statRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)',
    },
    statLabel: {
        color: 'var(--text-secondary)',
    },
    statValue: {
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    noData: {
        padding: '80px 40px',
        textAlign: 'center',
        fontSize: '16px',
        color: 'var(--text-secondary)',
    },
    loading: {
        padding: '100px 20px',
        textAlign: 'center',
    },
    loadingText: {
        marginTop: '16px',
        color: 'var(--text-secondary)',
    },
};
