'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProfileCard from '../../../components/ProfileCard';
import ProgressChart from '../../../components/ProgressChart';
import PlatformBadge from '../../../components/PlatformBadge';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

export default function ProfilePage() {
    const params = useParams();
    const username = params.username as string;
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [syncing, setSyncing] = useState(false);
    const [connectMode, setConnectMode] = useState(false);
    const [platforms, setPlatforms] = useState({
        githubUsername: '',
        leetcodeUsername: '',
        hackerrankUsername: '',
    });

    const isOwnProfile = currentUser?.username === username;

    useEffect(() => {
        fetchUser();
    }, [username]);

    const fetchUser = async () => {
        try {
            const response = await api.get(`/users/${username}`);
            setUser(response.data);
            setPlatforms({
                githubUsername: response.data.githubUsername || '',
                leetcodeUsername: response.data.leetcodeUsername || '',
                hackerrankUsername: response.data.hackerrankUsername || '',
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'User not found');
        } finally {
            setLoading(false);
        }
    };

    const handleSyncStats = async () => {
        setSyncing(true);
        try {
            await api.post('/users/sync');
            await fetchUser();
            alert('Stats synced successfully!');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to sync stats');
        } finally {
            setSyncing(false);
        }
    };

    const handleConnectPlatforms = async () => {
        try {
            await api.post('/users/connect-platforms', platforms);
            await fetchUser();
            setConnectMode(false);
            alert('Platforms connected and stats synced!');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to connect platforms');
        }
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div className="spinner"></div>
                <p style={styles.loadingText}>Loading profile...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div style={styles.error}>
                <div className="glass-card" style={styles.errorCard}>
                    <h2>😕 {error || 'User not found'}</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div className="container">
                <div style={styles.grid}>
                    <div>
                        <ProfileCard user={user} />

                        {isOwnProfile && (
                            <div className="glass-card" style={styles.actions}>
                                <h3 style={styles.actionsTitle}>Actions</h3>
                                <button
                                    onClick={handleSyncStats}
                                    className="btn btn-primary"
                                    disabled={syncing}
                                    style={styles.button}
                                >
                                    {syncing ? 'Syncing...' : '🔄 Sync Stats'}
                                </button>
                                <button
                                    onClick={() => setConnectMode(!connectMode)}
                                    className="btn btn-secondary"
                                    style={styles.button}
                                >
                                    🔗 {connectMode ? 'Cancel' : 'Connect Platforms'}
                                </button>

                                {connectMode && (
                                    <div style={styles.connectForm}>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="GitHub username"
                                            value={platforms.githubUsername}
                                            onChange={(e) => setPlatforms({ ...platforms, githubUsername: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="LeetCode username"
                                            value={platforms.leetcodeUsername}
                                            onChange={(e) => setPlatforms({ ...platforms, leetcodeUsername: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="HackerRank username"
                                            value={platforms.hackerrankUsername}
                                            onChange={(e) => setPlatforms({ ...platforms, hackerrankUsername: e.target.value })}
                                        />
                                        <button onClick={handleConnectPlatforms} className="btn btn-primary">
                                            Save & Sync
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        {user.platformStats && (
                            <div className="glass-card" style={styles.stats}>
                                <h3 style={styles.statsTitle}>Platform Breakdown</h3>
                                <div style={styles.statsList}>
                                    <div style={styles.statItem}>
                                        <span style={styles.statLabel}>GitHub Score</span>
                                        <span style={styles.statValue}>{user.platformStats.githubScore.toFixed(0)}</span>
                                    </div>
                                    <div style={styles.statItem}>
                                        <span style={styles.statLabel}>LeetCode Score</span>
                                        <span style={styles.statValue}>{user.platformStats.leetcodeScore.toFixed(0)}</span>
                                    </div>
                                    <div style={styles.statItem}>
                                        <span style={styles.statLabel}>HackerRank Score</span>
                                        <span style={styles.statValue}>{user.platformStats.hackerrankScore.toFixed(0)}</span>
                                    </div>
                                </div>

                                <div style={styles.details}>
                                    {user.githubUsername && (
                                        <div style={styles.detailSection}>
                                            <h4 style={styles.detailTitle}>⚡ GitHub</h4>
                                            <p>Repos: {user.platformStats.githubRepos}</p>
                                            <p>Stars: {user.platformStats.githubStars}</p>
                                            <p>Commits: {user.platformStats.githubCommits}</p>
                                        </div>
                                    )}
                                    {user.leetcodeUsername && (
                                        <div style={styles.detailSection}>
                                            <h4 style={styles.detailTitle}>🎯 LeetCode</h4>
                                            <p>Total Solved: {user.platformStats.leetcodeSolved}</p>
                                            <p>Easy: {user.platformStats.leetcodeEasy}</p>
                                            <p>Medium: {user.platformStats.leetcodeMedium}</p>
                                            <p>Hard: {user.platformStats.leetcodeHard}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <ProgressChart userId={user.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        padding: '60px 0',
        minHeight: 'calc(100vh - 80px)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '32px',
    },
    actions: {
        padding: '24px',
        marginTop: '24px',
    },
    actionsTitle: {
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '16px',
    },
    button: {
        width: '100%',
        marginBottom: '12px',
    },
    connectForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-color)',
    },
    stats: {
        padding: '24px',
    },
    statsTitle: {
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '20px',
    },
    statsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px',
    },
    statItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)',
    },
    statLabel: {
        color: 'var(--text-secondary)',
    },
    statValue: {
        fontWeight: '700',
        fontSize: '18px',
        color: 'var(--primary-light)',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    detailSection: {
        padding: '16px',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)',
    },
    detailTitle: {
        fontSize: '16px',
        fontWeight: '700',
        marginBottom: '12px',
    },
    loading: {
        padding: '100px 20px',
        textAlign: 'center',
    },
    loadingText: {
        marginTop: '16px',
        color: 'var(--text-secondary)',
    },
    error: {
        padding: '100px 20px',
        textAlign: 'center',
    },
    errorCard: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '60px 40px',
    },
};
