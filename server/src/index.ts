import app from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { startStatsSyncCron, startRankingUpdateCron } from './utils/cronJobs';

const PORT = parseInt(env.PORT) || 5000;

const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start cron jobs
        startStatsSyncCron();
        startRankingUpdateCron();

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Environment: ${env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n👋 Shutting down gracefully...');
    await disconnectDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n👋 Shutting down gracefully...');
    await disconnectDB();
    process.exit(0);
});

startServer();
