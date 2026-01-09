import { getRankTier } from './constants';

export const calculateRank = (score: number): string => {
    const tier = getRankTier(score);
    return `${tier.icon} ${tier.label}`;
};

export const formatScore = (score: number): string => {
    return score.toFixed(1);
};

export const getScorePercentage = (score: number): number => {
    return Math.min(Math.max(score, 0), 100);
};
