'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PlatformData {
    name: string;
    score: number;
    color: string;
}

interface PlatformBarChartProps {
    githubScore: number;
    leetcodeScore: number;
    hackerrankScore: number;
}

export default function PlatformBarChart({
    githubScore,
    leetcodeScore,
    hackerrankScore,
}: PlatformBarChartProps) {
    const data: PlatformData[] = [
        { name: 'GitHub', score: githubScore, color: '#ffffff' },
        { name: 'LeetCode', score: leetcodeScore, color: '#ffa116' },
        { name: 'HackerRank', score: hackerrankScore, color: '#00ea64' },
    ];

    return (
        <div className="glass-card" style={styles.container}>
            <h3 style={styles.title}>🎯 Platform Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="name"
                        stroke="var(--text-secondary)"
                        style={{ fontSize: '13px' }}
                    />
                    <YAxis
                        stroke="var(--text-secondary)"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                        }}
                    />
                    <Bar
                        dataKey="score"
                        fill="#6366f1"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        padding: '24px',
    },
    title: {
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '20px',
    },
};
