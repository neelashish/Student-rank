import { PrismaClient } from '@prisma/client';

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
    { name: 'Aligarh Muslim University', city: 'Aligarh' },
];

async function main() {
    console.log('🌱 Starting database seed...');

    try {
        // Delete existing colleges (optional - for clean slate)
        // await prisma.college.deleteMany();
        // console.log('🗑️  Cleared existing colleges');

        // Create colleges
        for (const college of colleges) {
            await prisma.college.upsert({
                where: { name: college.name },
                update: {},
                create: college,
            });
        }

        console.log(`✅ Seeded ${colleges.length} colleges successfully!`);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
