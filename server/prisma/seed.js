import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('🌱 Starting Database Reset & Clean Seeding...');

  try {
    // Disable Foreign Key checks for MySQL reset
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);

    // Truncate all tables & reset AUTO_INCREMENT to 1
    const tables = [
      'SosAlert',
      'SosLocation',
      'SosSession',
      'Checkin',
      'Journey',
      'TrustedContact',
      'PaymentHistory',
      'PushSubscription',
      'User',
      'Plan',
      'SystemSetting',
    ];

    for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${table}\`;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` AUTO_INCREMENT = 1;`);
      } catch (e) {
        try {
          await prisma.$executeRawUnsafe(`DELETE FROM \`${table}\`;`);
          await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` AUTO_INCREMENT = 1;`);
        } catch (e2) {}
      }
    }

    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
    console.log('✨ All DB tables cleared & AUTO_INCREMENT counter reset to start from 1!');
  } catch (err) {
    console.warn('⚠️ Table reset notice:', err.message);
  }

  // 1. Seed SuperAdmin Account with ID = 1
  const superAdminEmail = 'abhijeetambhore4@gmail.com';
  const passwordHash = await bcrypt.hash('Veagle@123', 10);

  const superAdmin = await prisma.user.create({
    data: {
      id: 1,
      fullName: 'Super Admin',
      email: superAdminEmail,
      phone: '7756099153',
      passwordHash,
      role: 'SUPER_ADMIN',
      isEmailVerified: true,
      subscriptionStatus: 'ACTIVE',
      onboardingStep: 7,
    },
  });
  console.log(`✅ [Seed] SuperAdmin Account Created (ID: ${superAdmin.id}): ${superAdmin.email} (Password: Veagle@123)`);

  // 2. Seed Default 365-Day Plan with ID = 1
  const singlePlanData = {
    id: 1,
    name: 'Sakhi Suraksha 365 Yearly Protection Plan',
    description: 'Complete 365-Day 24/7 Unlimited SOS Emergency Broadcast, Live GPS Map Sharing, 5 Trusted Contacts Network, and HQ Command Dispatch',
    basePrice: 24.0,
    gstPercentage: 18.0,
    totalPrice: 28.32,
    durationDays: 365,
    isActive: true,
  };

  const p = await prisma.plan.create({
    data: singlePlanData,
  });
  console.log(`✅ [Seed] Subscription Plan Created (ID: ${p.id}): ${p.name}`);

  // 3. Seed System Setting for GST
  await prisma.systemSetting.create({
    data: { key: 'GST_PERCENTAGE', value: '18.0' },
  });
  console.log('✅ [Seed] System Setting Created (GST: 18.0%)');

  console.log('🎉 Database Reset & Seeding Completed Successfully! Next inserted record will start from ID = 2.');
}

if (process.argv[1] && process.argv[1].includes('seed.js')) {
  seedDatabase()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error('❌ Seeding Error:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
