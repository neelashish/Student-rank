import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://studentrank_user:fkBWeUsHXu4JiT4xBIN73huMCgDupUN7@dpg-d5jq6vtactks73cf6afg-a.oregon-postgres.render.com:5432/studentrank'
        }
    }
});

async function checkAndSeed() {
    try {
        const count = await prisma.college.count();
        console.log(`✅ Connected to Render database`);
        console.log(`📊 Current colleges: ${count}`);

        if (count === 0) {
            console.log('🌱 Seeding database...');
            // Run seed
            const { exec } = require('child_process');
            exec('npx prisma db seed', {
                env: { ...process.env, DATABASE_URL: process.env.RENDER_DB_URL }
            }, (error, stdout, stderr) => {
                if (error) {
                    console.error('❌ Seed failed:', error);
                } else {
                    console.log(stdout);
                }
            });
        } else {
            console.log('✅ Database already has colleges!');
        }
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAndSeed();
