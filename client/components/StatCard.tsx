'use client';

interface StatCardProps {
    icon: string;
    label: string;
    value: string | number;
    change?: number;
    color?: string;
}

export default function StatCard({ icon, label, value, change, color }: StatCardProps) {
    return (
        <div className="glass-card" style={styles.card}>
            <div style={styles.iconContainer}>
                <span style={{ ...styles.icon, color: color || 'var(--primary-light)' }}>
                    {icon}
                </span>
            </div>
            <div style={styles.content}>
                <div style={styles.label}>{label}</div>
                <div style={styles.value}>{value}</div>
                {change !== undefined && change !== 0 && (
                    <div style={{
                        ...styles.change,
                        color: change > 0 ? '#4ade80' : '#f87171',
                    }}>
                        {change > 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    card: {
        padding: '20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
    },
    iconContainer: {
        width: '56px',
        height: '56px',
        borderRadius: '12px',
        background: 'var(--bg-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    icon: {
        fontSize: '28px',
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: '13px',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '4px',
    },
    value: {
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    change: {
        fontSize: '12px',
        fontWeight: '600',
        marginTop: '4px',
    },
};
