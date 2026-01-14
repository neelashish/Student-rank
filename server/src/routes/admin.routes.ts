import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const colleges = [
    // IITs
    { name: 'IIT Kharagpur', city: 'Kharagpur' },
    { name: 'IIT Bombay', city: 'Mumbai' },
    { name: 'IIT Delhi', city: 'New Delhi' },
    { name: 'IIT Madras', city: 'Chennai' },
    { name: 'IIT Kanpur', city: 'Kanpur' },
    { name: 'IIT Roorkee', city: 'Roorkee' },
    { name: 'IIT Guwahati', city: 'Guwahati' },
    { name: 'IIT Hyderabad', city: 'Hyderabad' },

    // NITs
    { name: 'NIT Trichy', city: 'Tiruchirappalli' },
    { name: 'NIT Warangal', city: 'Warangal' },
    { name: 'NIT Surathkal', city: 'Mangalore' },
    { name: 'NIT Calicut', city: 'Calicut' },
    { name: 'NIT Rourkela', city: 'Rourkela' },

    // IIITs
    { name: 'IIIT Hyderabad', city: 'Hyderabad' },
    { name: 'IIIT Bangalore', city: 'Bangalore' },
    { name: 'IIIT Delhi', city: 'New Delhi' },
    { name: 'IIIT Allahabad', city: 'Prayagraj' },

    // Other Top Colleges
    { name: 'BITS Pilani', city: 'Pilani' },
    { name: 'BITS Goa', city: 'Goa' },
    { name: 'BITS Hyderabad', city: 'Hyderabad' },
    { name: 'VIT Vellore', city: 'Vellore' },
    { name: 'VIT Chennai', city: 'Chennai' },
    { name: 'Manipal Institute of Technology', city: 'Manipal' },
    { name: 'DTU Delhi', city: 'New Delhi' },
    { name: 'NSUT Delhi', city: 'New Delhi' },
    { name: 'IIIT Pune', city: 'Pune' },
    { name: 'ICT Mumbai', city: 'Mumbai' },
    { name: 'Anna University', city: 'Chennai' },
    { name: 'Jadavpur University', city: 'Kolkata' },
    { name: 'BIT Mesra', city: 'Ranchi' },
    { name: 'COEP Pune', city: 'Pune' },
    { name: 'PSG Tech Coimbatore', city: 'Coimbatore' },
    { name: 'Thapar University', city: 'Patiala' },
    { name: 'SRM University', city: 'Chennai' },
    { name: 'Amity University', city: 'Noida' },
    { name: 'LPU Jalandhar', city: 'Jalandhar' },
    { name: 'PEC Chandigarh', city: 'Chandigarh' },
    { name: 'Jamia Millia Islamia', city: 'New Delhi' },
];

/**
 * Seed database with colleges (Admin endpoint - temporary)
 */
router.post('/seed-colleges', async (req: Request, res: Response) => {
    try {
        console.log('🌱 Starting database seed via admin endpoint...');

        let created = 0;
        let skipped = 0;

        for (const college of colleges) {
            const existing = await prisma.college.findUnique({
                where: { name: college.name }
            });

            if (!existing) {
                await prisma.college.create({ data: college });
                created++;
            } else {
                skipped++;
            }
        }

        console.log(`✅ Seeding complete! Created: ${created}, Skipped: ${skipped}`);

        res.json({
            success: true,
            message: 'Database seeded successfully',
            created,
            skipped,
            total: colleges.length
        });
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to seed database',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
