'use client';

import Link from 'next/link';
import PlatformBadge from './PlatformBadge';
import { getRankTier } from '../utils/constants';

interface User {
    id: string;
    name: string;
    username: string;
    totalScore: number;
    rank: number | null;
    college: {
        name: string;
        city: string;
    };
    githubUsername?: string | null;
    leetcodeUsername?: string | null;
    hackerrankUsername?: string | null;
    platformStats?: {
        githubScore: number;
        leetcodeScore: number;
        hackerrankScore: number;
    } | null;
}

interface ProfileCardProps {
    user: User;
    showRank?: boolean;
}

export default function ProfileCard({ user, showRank = true }: ProfileCardProps) {
    const tier = getRankTier(user.totalScore);

    return (
        <div className="glass-card" style={styles.card}>
            <div style={styles.header}>
                <div style={styles.avatar}>
                    <span style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div style={styles.info}>
                    <Link href={`/profile/${user.username}`} style={styles.name}>
                        {user.name}
                    </Link>
                    <p style={styles.username}>@{user.username}</p>
                    <p style={styles.college}>
                        🎓 {user.college.name}, {user.college.city}
                    </p>
                </div>
            </div>

            <div style={styles.stats}>
                <div style={styles.statItem}>
                    <div style={styles.statValue}>{user.totalScore.toFixed(1)}</div>
                    <div style={styles.statLabel}>Score</div>
                </div>
                {showRank && user.rank && (
                    <div style={styles.statItem}>
                        <div style={styles.statValue}>#{user.rank}</div>
                        <div style={styles.statLabel}>Rank</div>
                    </div>
                )}
                <div style={styles.statItem}>
                    <div style={{ ...styles.statValue, color: tier.color }}>
                        {tier.icon}
                    </div>
                    <div style={styles.statLabel}>{tier.label}</div>
                </div>
            </div>

            {user.platformStats && (
                <div style={styles.platforms}>
                    {user.githubUsername && (
                        <PlatformBadge
                            platform="github"
                            username={user.githubUsername}
                            score={user.platformStats.githubScore}
                        />
                    )}
                    {user.leetcodeUsername && (
                        <PlatformBadge
                            platform="leetcode"
                            username={user.leetcodeUsername}
                            score={user.platformStats.leetcodeScore}
                        />
                    )}
                    {user.hackerrankUsername && (
                        <PlatformBadge
                            platform="hackerrank"
                            username={user.hackerrankUsername}
                            score={user.platformStats.hackerrankScore}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    card: {
        padding: '24px',
    },
    header: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
    },
    avatar: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    avatarText: {
        fontSize: '28px',
        fontWeight: '700',
        color: 'white',
    },
    info: {
        flex: 1,
        minWidth: 0,
    },
    name: {
        fontSize: '20px',
        fontWeight: '700',
        color: 'var(--text-primary)',
        textDecoration: 'none',
        display: 'block',
        marginBottom: '4px',
    },
    username: {
        color: 'var(--text-secondary)',
        fontSize: '14px',
        marginBottom: '4px',
    },
    college: {
        color: 'var(--text-tertiary)',
        fontSize: '13px',
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '20px',
        padding: '16px',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)',
    },
    statItem: {
        textAlign: 'center',
    },
    statValue: {
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '4px',
    },
    statLabel: {
        fontSize: '12px',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    platforms: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
    },
};
