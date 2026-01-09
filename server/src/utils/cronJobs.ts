import cron from 'node-cron';
import { prisma } from '../config/db';
import { syncUserStats } from '../services/ranking.service';

/**
 * Cron job to sync all users' platform stats
 * Runs every day at 2 AM
 */
export const startStatsSyncCron = () => {
    cron.schedule('0 2 * * *', async () => {
        console.log('🔄 Starting scheduled stats sync...');

        try {
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { githubUsername: { not: null } },
                        { leetcodeUsername: { not: null } },
                        { hackerrankUsername: { not: null } },
                    ],
                },
            });

            console.log(`📊 Syncing stats for ${users.length} users...`);

            let successCount = 0;
            let errorCount = 0;

            for (const user of users) {
                try {
                    await syncUserStats(user.id);
                    successCount++;
                } catch (error) {
                    console.error(`❌ Failed to sync stats for user ${user.username}:`, error);
                    errorCount++;
                }
            }

            console.log(`✅ Stats sync completed. Success: ${successCount}, Errors: ${errorCount}`);
        } catch (error) {
            console.error('❌ Stats sync cron job failed:', error);
        }
    });

    console.log('⏰ Stats sync cron job scheduled (daily at 2 AM)');
};

/**
 * Cron job to update rankings
 * Runs every hour
 */
export const startRankingUpdateCron = () => {
    cron.schedule('0 * * * *', async () => {
        console.log('🔄 Updating rankings...');

        try {
            // Get all users ordered by totalScore
            const users = await prisma.user.findMany({
                orderBy: { totalScore: 'desc' },
                select: { id: true, totalScore: true },
            });

            // Update ranks
            for (let i = 0; i < users.length; i++) {
                await prisma.user.update({
                    where: { id: users[i].id },
                    data: { rank: i + 1 },
                });
            }

            console.log(`✅ Rankings updated for ${users.length} users`);
        } catch (error) {
            console.error('❌ Ranking update cron job failed:', error);
        }
    });

    console.log('⏰ Ranking update cron job scheduled (hourly)');
};
