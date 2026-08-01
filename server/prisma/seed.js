import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Check if SuperAdmin exists. If not, seed default SuperAdmin account.
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  if (!existingSuperAdmin) {
    const superAdminEmail = 'admin@veaglesafety.org';
    const passwordHash = await bcrypt.hash('Veagle@123', 10);
    const superAdmin = await prisma.user.create({
      data: {
        fullName: 'Super Admin',
        email: superAdminEmail,
        phone: '+91 90000 00000',
        passwordHash,
        role: 'SUPER_ADMIN',
        isEmailVerified: true,
        subscriptionStatus: 'ACTIVE',
        onboardingStep: 7,
      },
    });
    console.log(`✅ [Seed] Default SuperAdmin Account Created: ${superAdmin.email} (Password: Veagle@123)`);
  } else {
    console.log(`ℹ️ [Seed] Preserving existing SuperAdmin account in DB: ${existingSuperAdmin.email}`);
  }

  // 2. Clean up old/extra plans — keep ONLY the single 365-Day Protection Plan
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

  // Remove any legacy plans
  await prisma.plan.deleteMany({
    where: {
      id: { not: 1 }
    }
  });

  const p = await prisma.plan.upsert({
    where: { id: 1 },
    update: singlePlanData,
    create: singlePlanData,
  });
  console.log(`✅ [Seed] Plan ID '${p.id}' Ready: ${p.name} (Base: ₹${p.basePrice}, Total: ₹${p.totalPrice})`);

  // 3. Seed System Setting for GST
  await prisma.systemSetting.upsert({
    where: { key: 'GST_PERCENTAGE' },
    update: { value: '18.0' },
    create: { key: 'GST_PERCENTAGE', value: '18.0' },
  });
  console.log('✅ [Seed] System Settings Ready (GST: 18.0%)');

  console.log('🎉 Database Seeding Completed Successfully!');
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
