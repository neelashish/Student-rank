import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { collegeSchema } from '../models/College';

/**
 * Get all colleges
 */
export const getAllColleges = async (req: Request, res: Response) => {
    try {
        const colleges = await prisma.college.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                city: true,
                _count: {
                    select: { users: true },
                },
            },
        });

        res.json(colleges);
    } catch (error) {
        console.error('Error fetching colleges:', error);
        res.status(500).json({ error: 'Failed to fetch colleges' });
    }
};

/**
 * Get college by ID
 */
export const getCollegeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const college = await prisma.college.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                city: true,
                _count: {
                    select: { users: true },
                },
            },
        });

        if (!college) {
            return res.status(404).json({ error: 'College not found' });
        }

        res.json(college);
    } catch (error) {
        throw error;
    }
};

/**
 * Create a new college (admin only - for now open to all)
 */
export const createCollege = async (req: Request, res: Response) => {
    try {
        const validatedData = collegeSchema.parse(req.body);

        const college = await prisma.college.create({
            data: validatedData,
        });

        res.status(201).json({
            message: 'College created successfully',
            college,
        });
    } catch (error) {
        throw error;
    }
};
