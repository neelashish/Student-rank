import app from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { startStatsSyncCron, startRankingUpdateCron } from './utils/cronJobs';
import { PrismaClient } from '@prisma/client';

const PORT = parseInt(env.PORT) || 5000;
const prisma = new PrismaClient();

// Colleges data for auto-seeding
const colleges = [
    { name: 'IIT Kharagpur', city: 'Kharagpur' },
    { name: 'IIT Bombay', city: 'Mumbai' },
    { name: 'IIT Delhi', city: 'New Delhi' },
    { name: 'IIT Madras', city: 'Chennai' },
    { name: 'IIT Kanpur', city: 'Kanpur' },
    { name: 'IIT Roorkee', city: 'Roorkee' },
    { name: 'IIT Guwahati', city: 'Guwahati' },
    { name: 'IIT Hyderabad', city: 'Hyderabad' },
    { name: 'NIT Trichy', city: 'Tiruchirappalli' },
    { name: 'NIT Warangal', city: 'Warangal' },
    { name: 'NIT Surathkal', city: 'Mangalore' },
    { name: 'NIT Calicut', city: 'Calicut' },
    { name: 'NIT Rourkela', city: 'Rourkela' },
    { name: 'IIIT Hyderabad', city: 'Hyderabad' },
    { name: 'IIIT Bangalore', city: 'Bangalore' },
    { name: 'IIIT Delhi', city: 'New Delhi' },
    { name: 'IIIT Allahabad', city: 'Prayagraj' },
    { name: 'BITS Pilani', city: 'Pilani' },
    { name: 'BITS Goa', city: 'Goa' },
    { name: 'BITS Hyderabad', city: 'Hyderabad' },
    { name: 'VIT Vellore', city: 'Vellore' },
    { name: 'VIT Chennai', city: 'Chennai' },
    { name: 'Manipal Institute of Technology', city: 'Manipal' },
    { name: 'DTU Delhi', city: 'New Delhi' },
    { name: 'NSUT Delhi', city: 'New Delhi' },
    { name: 'Anna University', city: 'Chennai' },
    { name: 'Jadavpur University', city: 'Kolkata' },
];

const autoSeedColleges = async () => {
    try {
        const count = await prisma.college.count();
        if (count === 0) {
            console.log('🌱 Database is empty. Auto-seeding colleges...');
            for (const college of colleges) {
                await prisma.college.create({ data: college });
            }
            console.log(`✅ Auto-seeded ${colleges.length} colleges successfully!`);
        } else {
            console.log(`✅ Database already has ${count} colleges`);
        }
    } catch (error) {
        console.error('⚠️  Auto-seed failed:', error);
        // Don't crash the server if seeding fails
    }
};

const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Auto-seed colleges if database is empty
        await autoSeedColleges();

        // Start cron jobs
        startStatsSyncCron();
        startRankingUpdateCron();

        // Start server
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
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
