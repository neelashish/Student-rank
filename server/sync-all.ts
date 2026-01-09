import { prisma } from './src/config/db';
import { syncUserStats } from './src/services/ranking.service';

async function syncAllUsers() {
    console.log('🔄 Starting sync for all users...');

    const users = await prisma.user.findMany({
        select: { id: true, username: true }
    });

    console.log(`Found ${users.length} users`);

    for (const user of users) {
        try {
            console.log(`Syncing ${user.username}...`);
            await syncUserStats(user.id);
            console.log(`✅ ${user.username} synced`);
        } catch (error: any) {
            console.error(`❌ Failed to sync ${user.username}:`, error.message);
        }
    }

    console.log('✅ All users synced!');
    process.exit(0);
}

syncAllUsers();
