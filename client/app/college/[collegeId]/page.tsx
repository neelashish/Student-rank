'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LeaderboardTable from '../../../components/LeaderboardTable';
import api from '../../../services/api';

export default function CollegePage() {
    const params = useParams();
    const collegeId = params.collegeId as string;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCollegeLeaderboard();
    }, [collegeId]);

    const fetchCollegeLeaderboard = async () => {
        try {
            const response = await api.get(`/leaderboard/college/${collegeId}`);
            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load college leaderboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div className="spinner"></div>
                <p style={styles.loadingText}>Loading...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div style={styles.error}>
                <div className="glass-card" style={styles.errorCard}>
                    <h2>😕 {error || 'College not found'}</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div className="container">
                <div style={styles.header}>
                    <h1 style={styles.title}>🎓 {data.college.name}</h1>
                    <p style={styles.subtitle}>{data.college.city}</p>
                    <p style={styles.count}>{data.total} students</p>
                </div>

                {data.users.length > 0 ? (
                    <LeaderboardTable users={data.users} />
                ) : (
                    <div className="glass-card" style={styles.empty}>
                        <p>No students from this college yet</p>
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
        textAlign: 'center',
    },
    title: {
        fontSize: '48px',
        fontWeight: '800',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '20px',
        color: 'var(--text-secondary)',
        marginBottom: '8px',
    },
    count: {
        color: 'var(--text-tertiary)',
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
    empty: {
        padding: '80px 40px',
        textAlign: 'center',
    },
};
