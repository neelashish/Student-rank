'use client';

import { useState, useEffect } from 'react';
import api from '../services/api';
import ScoreLineChart from './ScoreLineChart';

interface ProgressChartProps {
    userId: string;
}

export default function ProgressChart({ userId }: ProgressChartProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, [userId]);

    const fetchHistory = async () => {
        try {
            const response = await api.get(`/analytics/history/${userId}?days=30`);
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="glass-card" style={styles.container}>
                <div style={styles.loading}>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="glass-card" style={styles.container}>
                <h3 style={styles.title}>Progress Over Time</h3>
                <div style={styles.placeholder}>
                    <p style={styles.text}>📈 No progress data yet</p>
                    <p style={styles.subtext}>Sync your stats to start tracking progress!</p>
                </div>
            </div>
        );
    }

    return <ScoreLineChart data={history} />;
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        padding: '24px',
    },
    title: {
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '16px',
        color: 'var(--text-primary)',
    },
    placeholder: {
        padding: '40px 20px',
        textAlign: 'center',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)',
    },
    text: {
        fontSize: '24px',
        marginBottom: '8px',
    },
    subtext: {
        color: 'var(--text-secondary)',
        fontSize: '14px',
    },
    loading: {
        padding: '60px 20px',
        textAlign: 'center',
    },
};
