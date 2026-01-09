'use client';

import Link from 'next/link';
import PlatformBadge from './PlatformBadge';
import { getRankTier } from '../utils/constants';

interface LeaderboardUser {
    id: string;
    name: string;
    username: string;
    totalScore: number;
    rank: number | null;
    college: {
        id: string;
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

interface LeaderboardTableProps {
    users: LeaderboardUser[];
}

export default function LeaderboardTable({ users }: LeaderboardTableProps) {
    if (!users || users.length === 0) {
        return (
            <div style={styles.empty}>
                <p style={styles.emptyText}>No users found</p>
            </div>
        );
    }

    return (
        <div className="glass-card" style={styles.container}>
            <div style={styles.tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th style={styles.thRank}>Rank</th>
                            <th>Student</th>
                            <th>College</th>
                            <th style={styles.thCenter}>Score</th>
                            <th style={styles.thCenter}>Tier</th>
                            <th>Platforms</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
                            const tier = getRankTier(user.totalScore);
                            const displayRank = user.rank || index + 1;

                            return (
                                <tr key={user.id} style={styles.row}>
                                    <td style={styles.rank}>
                                        <div style={styles.rankBadge(displayRank)}>
                                            {displayRank <= 3 ? getMedalEmoji(displayRank) : `#${displayRank}`}
                                        </div>
                                    </td>
                                    <td>
                                        <Link href={`/profile/${user.username}`} style={styles.userLink}>
                                            <div style={styles.userInfo}>
                                                <div style={styles.avatar}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={styles.userName}>{user.name}</div>
                                                    <div style={styles.username}>@{user.username}</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td>
                                        <div style={styles.college}>{user.college.name}</div>
                                        <div style={styles.city}>{user.college.city}</div>
                                    </td>
                                    <td style={styles.tdCenter}>
                                        <div style={styles.score}>{user.totalScore.toFixed(1)}</div>
                                    </td>
                                    <td style={styles.tdCenter}>
                                        <div style={{ ...styles.tierBadge, color: tier.color }}>
                                            {tier.icon} {tier.label}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={styles.platforms}>
                                            {user.githubUsername && (
                                                <PlatformBadge platform="github" username={user.githubUsername} />
                                            )}
                                            {user.leetcodeUsername && (
                                                <PlatformBadge platform="leetcode" username={user.leetcodeUsername} />
                                            )}
                                            {user.hackerrankUsername && (
                                                <PlatformBadge platform="hackerrank" username={user.hackerrankUsername} />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const getMedalEmoji = (rank: number): string => {
    switch (rank) {
        case 1:
            return '🥇';
        case 2:
            return '🥈';
        case 3:
            return '🥉';
        default:
            return '';
    }
};

const styles: Record<string, any> = {
    container: {
        padding: 0,
        overflow: 'hidden',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    thRank: {
        width: '80px',
    },
    thCenter: {
        textAlign: 'center',
    },
    tdCenter: {
        textAlign: 'center',
    },
    row: {
        transition: 'all 0.2s ease',
    },
    rank: {
        padding: '16px',
    },
    rankBadge: (rank: number) => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: rank <= 3 ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
        fontWeight: '700',
        fontSize: rank <= 3 ? '24px' : '16px',
    }),
    userLink: {
        textDecoration: 'none',
        color: 'inherit',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '16px',
        flexShrink: 0,
    },
    userName: {
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '2px',
    },
    username: {
        fontSize: '13px',
        color: 'var(--text-tertiary)',
    },
    college: {
        color: 'var(--text-secondary)',
        fontSize: '14px',
        marginBottom: '2px',
    },
    city: {
        color: 'var(--text-tertiary)',
        fontSize: '12px',
    },
    score: {
        fontSize: '20px',
        fontWeight: '700',
        color: 'var(--primary-light)',
    },
    tierBadge: {
        fontSize: '14px',
        fontWeight: '600',
    },
    platforms: {
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
    },
    empty: {
        padding: '60px 20px',
        textAlign: 'center',
    },
    emptyText: {
        color: 'var(--text-secondary)',
        fontSize: '16px',
    },
};
