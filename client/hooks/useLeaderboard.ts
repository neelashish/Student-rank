'use client';

import { useState, useEffect } from 'react';
import api from '../services/api';

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
    platformStats: {
        githubScore: number;
        leetcodeScore: number;
        hackerrankScore: number;
    } | null;
}

interface LeaderboardData {
    users: LeaderboardUser[];
    total: number;
    limit: number;
    offset: number;
}

export const useLeaderboard = (collegeId?: string) => {
    const [data, setData] = useState<LeaderboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError(null);

        try {
            const params: any = { limit: 50, offset: 0 };
            if (collegeId) {
                params.collegeId = collegeId;
            }

            const response = await api.get('/leaderboard', { params });
            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch leaderboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [collegeId]);

    return { data, loading, error, refetch: fetchLeaderboard };
};
