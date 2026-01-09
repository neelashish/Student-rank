import { ZodError } from 'zod';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { env } from '../config/env';
import { registerSchema, loginSchema } from '../models/User';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    { username: validatedData.username },
                ],
            },
        });

        if (existingUser) {
            return res.status(409).json({
                error: existingUser.email === validatedData.email
                    ? 'Email already registered'
                    : 'Username already taken',
            });
        }

        // Check if college exists
        const college = await prisma.college.findUnique({
            where: { id: validatedData.collegeId },
        });

        if (!college) {
            return res.status(404).json({ error: 'College not found' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                username: validatedData.username,
                collegeId: validatedData.collegeId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                collegeId: true,
                college: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                    },
                },
            },
        });

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(201).json({
            message: 'User registered successfully',
            user,
            token,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.errors,
            });
        }

        console.error('REGISTER ERROR:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
            include: {
                college: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if user is OAuth user (no password set)
        if (!user.password) {
            return res.status(401).json({
                error: 'This account uses OAuth login. Please use "Continue with GitHub" or "Continue with Google"'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
            validatedData.password,
            user.password
        );

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.errors,
            });
        }

        console.error('LOGIN ERROR:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
