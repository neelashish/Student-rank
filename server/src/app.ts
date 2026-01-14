import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import collegeRoutes from './routes/college.routes';
import analyticsRoutes from './routes/analytics.routes';
import oauthRoutes from './routes/oauth.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { env } from './config/env';

const app = express();

// CORS Configuration
app.use(cors({
    origin: env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/oauth', oauthRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorMiddleware);

export default app;
