import { Request, Response } from 'express';
import { prisma } from '../config/db';

/**
 * Get global leaderboard
 */
export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const { limit = '50', offset = '0', collegeId } = req.query;

        const whereClause: any = {};

        if (collegeId) {
            whereClause.collegeId = collegeId as string;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: whereClause,
                orderBy: { totalScore: 'desc' },
                take: parseInt(limit as string),
                skip: parseInt(offset as string),
                select: {
                    id: true,
                    name: true,
                    username: true,
                    totalScore: true,
                    rank: true,
                    githubUsername: true,
                    leetcodeUsername: true,
                    hackerrankUsername: true,
                    college: {
                        select: {
                            id: true,
                            name: true,
                            city: true,
                        },
                    },
                    platformStats: {
                        select: {
                            githubScore: true,
                            leetcodeScore: true,
                            hackerrankScore: true,
                        },
                    },
                },
            }),
            prisma.user.count({ where: whereClause }),
        ]);

        res.json({
            users,
            total,
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Get college-specific leaderboard
 */
export const getCollegeLeaderboard = async (req: Request, res: Response) => {
    try {
        const { collegeId } = req.params;
        const { limit = '50', offset = '0' } = req.query;

        const [users, total, college] = await Promise.all([
            prisma.user.findMany({
                where: { collegeId },
                orderBy: { totalScore: 'desc' },
                take: parseInt(limit as string),
                skip: parseInt(offset as string),
                select: {
                    id: true,
                    name: true,
                    username: true,
                    totalScore: true,
                    rank: true,
                    githubUsername: true,
                    leetcodeUsername: true,
                    hackerrankUsername: true,
                    platformStats: {
                        select: {
                            githubScore: true,
                            leetcodeScore: true,
                            hackerrankScore: true,
                        },
                    },
                },
            }),
            prisma.user.count({ where: { collegeId } }),
            prisma.college.findUnique({ where: { id: collegeId } }),
        ]);

        if (!college) {
            return res.status(404).json({ error: 'College not found' });
        }

        res.json({
            college,
            users,
            total,
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
        });
    } catch (error) {
        throw error;
    }
};
