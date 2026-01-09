import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';
import { updateProfileSchema, connectPlatformsSchema } from '../models/User';
import { syncUserStats } from '../services/ranking.service';

/**
 * Get current user profile
 */
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                collegeId: true,
                githubUsername: true,
                leetcodeUsername: true,
                hackerrankUsername: true,
                linkedinUrl: true,
                totalScore: true,
                rank: true,
                lastSyncedAt: true,
                college: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                    },
                },
                platformStats: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        throw error;
    }
};

/**
 * Get user profile by username
 */
export const getUserByUsername = async (req: AuthRequest, res: Response) => {
    try {
        const { username } = req.params;

        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                name: true,
                username: true,
                collegeId: true,
                githubUsername: true,
                leetcodeUsername: true,
                hackerrankUsername: true,
                linkedinUrl: true,
                totalScore: true,
                rank: true,
                lastSyncedAt: true,
                college: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                    },
                },
                platformStats: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        throw error;
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const validatedData = updateProfileSchema.parse(req.body);

        const user = await prisma.user.update({
            where: { id: req.userId },
            data: validatedData,
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                githubUsername: true,
                leetcodeUsername: true,
                hackerrankUsername: true,
                linkedinUrl: true,
            },
        });

        res.json({
            message: 'Profile updated successfully',
            user,
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Connect platform usernames
 */
export const connectPlatforms = async (req: AuthRequest, res: Response) => {
    try {
        const validatedData = connectPlatformsSchema.parse(req.body);

        // Update user with platform usernames
        const user = await prisma.user.update({
            where: { id: req.userId },
            data: validatedData,
        });

        // Sync stats immediately
        const scores = await syncUserStats(req.userId!);

        res.json({
            message: 'Platforms connected and stats synced successfully',
            scores,
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Manually trigger stats sync
 */
export const syncStats = async (req: AuthRequest, res: Response) => {
    try {
        const scores = await syncUserStats(req.userId!);

        res.json({
            message: 'Stats synced successfully',
            scores,
        });
    } catch (error) {
        throw error;
    }
};
