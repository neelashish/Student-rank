'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ScoreDataPoint {
    recordedAt: string;
    totalScore: number;
    githubScore: number;
    leetcodeScore: number;
    hackerrankScore: number;
}

interface ScoreLineChartProps {
    data: ScoreDataPoint[];
}

export default function ScoreLineChart({ data }: ScoreLineChartProps) {
    const formattedData = data.map((point) => ({
        ...point,
        date: new Date(point.recordedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        }),
    }));

    return (
        <div className="glass-card" style={styles.container}>
            <h3 style={styles.title}>📈 Score Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="date"
                        stroke="var(--text-secondary)"
                        style={{ fontSize: '12px' }}
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
                    <Legend
                        wrapperStyle={{
                            paddingTop: '20px',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="totalScore"
                        stroke="#6366f1"
                        strokeWidth={3}
                        name="Total Score"
                        dot={{ fill: '#6366f1', r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="githubScore"
                        stroke="#ffffff"
                        strokeWidth={2}
                        name="GitHub"
                        dot={{ fill: '#ffffff', r: 3 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="leetcodeScore"
                        stroke="#ffa116"
                        strokeWidth={2}
                        name="LeetCode"
                        dot={{ fill: '#ffa116', r: 3 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="hackerrankScore"
                        stroke="#00ea64"
                        strokeWidth={2}
                        name="HackerRank"
                        dot={{ fill: '#00ea64', r: 3 }}
                    />
                </LineChart>
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
