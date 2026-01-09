import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { env } from '../config/env';
import axios from 'axios';

/**
 * GitHub OAuth Handler
 */
export const githubOAuth = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Authorization code required' });
        }

        // Exchange code for access token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: { Accept: 'application/json' },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Get user data from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const githubUser = userResponse.data;

        // Get user's primary email
        const emailResponse = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const primaryEmail =
            emailResponse.data.find((email: any) => email.primary)?.email ||
            emailResponse.data[0]?.email ||
            githubUser.email;

        // Check if user exists
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: primaryEmail },
                    { providerId: String(githubUser.id), provider: 'github' },
                ],
            },
            include: {
                college: true,
            },
        });

        if (user) {
            // Update existing user with OAuth info
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    provider: 'github',
                    providerId: String(githubUser.id),
                    avatar: githubUser.avatar_url,
                    githubUsername: githubUser.login,
                },
                include: {
                    college: true,
                },
            });
        } else {
            // New user - return GitHub data for registration completion
            return res.json({
                requiresRegistration: true,
                githubData: {
                    name: githubUser.name || githubUser.login,
                    email: primaryEmail,
                    username: githubUser.login,
                    githubUsername: githubUser.login,
                    avatar: githubUser.avatar_url,
                    providerId: String(githubUser.id),
                },
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
            expiresIn: '7d',
        });

        const { password, ...userWithoutPassword } = user;

        res.json({
            message: 'GitHub login successful',
            user: userWithoutPassword,
            token,
        });
    } catch (error: any) {
        console.error('GitHub OAuth error:', error.response?.data || error.message);
        return res.status(500).json({ error: 'GitHub authentication failed' });
    }
};

/**
 * Google OAuth Handler
 */
export const googleOAuth = async (req: Request, res: Response) => {
    try {
        const { token: googleToken, code } = req.body;
        let accessToken = googleToken;

        // If code is provided, exchange it for access token
        if (code && !googleToken) {
            const tokenResponse = await axios.post(
                'https://oauth2.googleapis.com/token',
                {
                    code,
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback/google',
                    grant_type: 'authorization_code',
                }
            );
            accessToken = tokenResponse.data.access_token;
        }

        if (!accessToken) {
            return res.status(400).json({ error: 'Google token or code required' });
        }

        // Verify Google token and get user data
        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
        );

        const googleUser = response.data;

        // Check if user exists
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: googleUser.email },
                    { providerId: googleUser.sub, provider: 'google' },
                ],
            },
            include: {
                college: true,
            },
        });

        if (user) {
            // Update existing user with OAuth info
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    provider: 'google',
                    providerId: googleUser.sub,
                    avatar: googleUser.picture,
                },
                include: {
                    college: true,
                },
            });
        } else {
            // New user - return Google data for registration completion
            return res.json({
                requiresRegistration: true,
                googleData: {
                    name: googleUser.name,
                    email: googleUser.email,
                    avatar: googleUser.picture,
                    providerId: googleUser.sub,
                },
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
            expiresIn: '7d',
        });

        const { password, ...userWithoutPassword } = user;

        res.json({
            message: 'Google login successful',
            user: userWithoutPassword,
            token,
        });
    } catch (error: any) {
        console.error('Google OAuth error:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Google authentication failed' });
    }
};

/**
 * Complete OAuth registration
 */
export const completeOAuthRegistration = async (req: Request, res: Response) => {
    try {
        const { username, collegeId, provider, providerId, name, email, avatar, githubUsername } = req.body;

        // Check if username is taken
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                username,
                collegeId,
                provider,
                providerId,
                avatar,
                githubUsername: provider === 'github' ? githubUsername : undefined,
            },
            include: {
                college: true,
            },
        });

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
            expiresIn: '7d',
        });

        const { password, ...userWithoutPassword } = user;

        res.status(201).json({
            message: 'Registration completed successfully',
            user: userWithoutPassword,
            token,
        });
    } catch (error: any) {
        console.error('OAuth registration error:', error);
        return res.status(500).json({ error: 'Registration failed' });
    }
};
