import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens and underscores'),
    collegeId: z.string(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string(),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    githubUsername: z.string().optional(),
    leetcodeUsername: z.string().optional(),
    hackerrankUsername: z.string().optional(),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
});

export const connectPlatformsSchema = z.object({
    githubUsername: z.string().optional(),
    leetcodeUsername: z.string().optional(),
    hackerrankUsername: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ConnectPlatformsInput = z.infer<typeof connectPlatformsSchema>;
