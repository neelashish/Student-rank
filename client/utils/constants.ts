export const PLATFORMS = {
    GITHUB: {
        name: 'GitHub',
        color: '#ffffff',
        icon: '⚡',
        url: (username: string) => `https://github.com/${username}`,
    },
    LEETCODE: {
        name: 'LeetCode',
        color: '#ffa116',
        icon: '🎯',
        url: (username: string) => `https://leetcode.com/${username}`,
    },
    HACKERRANK: {
        name: 'HackerRank',
        color: '#00ea64',
        icon: '🏆',
        url: (username: string) => `https://www.hackerrank.com/${username}`,
    },
    LINKEDIN: {
        name: 'LinkedIn',
        color: '#0077b5',
        icon: '💼',
    },
} as const;

export const RANK_TIERS = [
    { min: 95, label: 'Legend', color: '#FFD700', icon: '👑' },
    { min: 85, label: 'Master', color: '#E5E4E2', icon: '💎' },
    { min: 70, label: 'Expert', color: '#CD7F32', icon: '⭐' },
    { min: 50, label: 'Intermediate', color: '#4facfe', icon: '🎯' },
    { min: 0, label: 'Beginner', color: '#a1a1aa', icon: '🌱' },
];

export const getRankTier = (score: number) => {
    return RANK_TIERS.find((tier) => score >= tier.min) || RANK_TIERS[RANK_TIERS.length - 1];
};
