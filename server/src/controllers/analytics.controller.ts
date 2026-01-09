import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';

/**
 * Get score history for a user
 */
export const getScoreHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { days = '30' } = req.query;

        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

        const history = await prisma.scoreHistory.findMany({
            where: {
                userId,
                recordedAt: {
                    gte: daysAgo,
                },
            },
            orderBy: {
                recordedAt: 'asc',
            },
        });

        res.json(history);
    } catch (error) {
        throw error;
    }
};

/**
 * Get platform breakdown history
 */
export const getPlatformHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { days = '30' } = req.query;

        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

        const history = await prisma.scoreHistory.findMany({
            where: {
                userId,
                recordedAt: {
                    gte: daysAgo,
                },
            },
            orderBy: {
                recordedAt: 'asc',
            },
            select: {
                recordedAt: true,
                githubScore: true,
                leetcodeScore: true,
                hackerrankScore: true,
                githubRepos: true,
                githubStars: true,
                leetcodeSolved: true,
                hackerrankStars: true,
            },
        });

        res.json(history);
    } catch (error) {
        throw error;
    }
};

/**
 * Get user stats summary
 */
export const getStatsSummary = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;

        // Get current stats
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                platformStats: true,
                college: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get score change over last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const recentHistory = await prisma.scoreHistory.findMany({
            where: {
                userId,
                recordedAt: {
                    gte: weekAgo,
                },
            },
            orderBy: {
                recordedAt: 'asc',
            },
            take: 2, // First and latest in the period
        });

        const scoreChange =
            recentHistory.length >= 2
                ? recentHistory[recentHistory.length - 1].totalScore - recentHistory[0].totalScore
                : 0;

        // Get college rank
        const collegeUsers = await prisma.user.findMany({
            where: {
                collegeId: user.collegeId,
            },
            orderBy: {
                totalScore: 'desc',
            },
            select: {
                id: true,
            },
        });

        const collegeRank = collegeUsers.findIndex((u) => u.id === userId) + 1;

        // Get total users count
        const totalUsers = await prisma.user.count();

        res.json({
            currentScore: user.totalScore,
            globalRank: user.rank || 0,
            collegeRank,
            totalUsers,
            scoreChange7Days: scoreChange,
            platformStats: user.platformStats,
            streakDays: 0, // TODO: Implement streak calculation
        });
    } catch (error) {
        throw error;
    }
};
