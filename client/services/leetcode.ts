import api from './api';

export interface LeetCodeStats {
    solved: number;
    easy: number;
    medium: number;
    hard: number;
    rating: number;
}

export const getLeetCodeStats = async (username: string): Promise<LeetCodeStats> => {
    // This would call our backend which then calls LeetCode API
    try {
        const response = await api.get(`/leetcode/${username}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch LeetCode stats');
    }
};
