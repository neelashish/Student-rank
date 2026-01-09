'use client';

import { useState, useEffect } from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import LeaderboardTable from '../../components/LeaderboardTable';
import api from '../../services/api';

interface College {
    id: string;
    name: string;
    city: string;
}

export default function LeaderboardPage() {
    const [selectedCollege, setSelectedCollege] = useState<string>('');
    const [colleges, setColleges] = useState<College[]>([]);
    const { data, loading, error } = useLeaderboard(selectedCollege || undefined);

    useEffect(() => {
        fetchColleges();
    }, []);

    const fetchColleges = async () => {
        try {
            const response = await api.get('/colleges');
            setColleges(response.data);
        } catch (err) {
            console.error('Failed to fetch colleges:', err);
        }
    };

    return (
        <div style={styles.container}>
            <div className="container">
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>🏆 Leaderboard</h1>
                        <p style={styles.subtitle}>
                            Top performing students across all platforms
                        </p>
                    </div>

                    <div style={styles.filter}>
                        <label style={styles.label}>Filter by College:</label>
                        <select
                            className="input"
                            value={selectedCollege}
                            onChange={(e) => setSelectedCollege(e.target.value)}
                            style={styles.select}
                        >
                            <option value="">All Colleges</option>
                            {colleges.map((college) => (
                                <option key={college.id} value={college.id}>
                                    {college.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div style={styles.loading}>
                        <div className="spinner"></div>
                        <p style={styles.loadingText}>Loading leaderboard...</p>
                    </div>
                ) : error ? (
                    <div className="glass-card" style={styles.error}>
                        <p>{error}</p>
                    </div>
                ) : data && data.users.length > 0 ? (
                    <>
                        <LeaderboardTable users={data.users} />
                        <div style={styles.stats}>
                            <p style={styles.statsText}>
                                Showing {data.users.length} of {data.total} students
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="glass-card" style={styles.empty}>
                        <p style={styles.emptyText}>
                            No students found. Be the first to register!
                        </p>
                    </div>
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
    filter: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minWidth: '240px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    select: {
        cursor: 'pointer',
    },
    loading: {
        padding: '80px 20px',
        textAlign: 'center',
    },
    loadingText: {
        marginTop: '16px',
        color: 'var(--text-secondary)',
    },
    error: {
        padding: '40px',
        textAlign: 'center',
        color: '#fca5a5',
    },
    empty: {
        padding: '80px 40px',
        textAlign: 'center',
    },
    emptyText: {
        fontSize: '18px',
        color: 'var(--text-secondary)',
    },
    stats: {
        marginTop: '24px',
        textAlign: 'center',
    },
    statsText: {
        color: 'var(--text-tertiary)',
        fontSize: '14px',
    },
};
