'use client';

import { PLATFORMS } from '../utils/constants';

interface PlatformBadgeProps {
    platform: 'github' | 'leetcode' | 'hackerrank' | 'linkedin';
    username?: string | null;
    score?: number;
}

export default function PlatformBadge({ platform, username, score }: PlatformBadgeProps) {
    const platformKey = platform.toUpperCase() as keyof typeof PLATFORMS;
    const platformData = PLATFORMS[platformKey];

    if (!username) return null;

    const url = 'url' in platformData ? platformData.url(username) : '#';

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="badge badge-primary"
            style={{
                ...styles.badge,
                borderColor: platformData.color,
            }}
        >
            <span>{platformData.icon}</span>
            <span>{platformData.name}</span>
            {score !== undefined && <span style={styles.score}>{score.toFixed(0)}</span>}
        </a>
    );
}

const styles: Record<string, React.CSSProperties> = {
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
    },
    score: {
        marginLeft: '4px',
        fontWeight: '700',
    },
};
