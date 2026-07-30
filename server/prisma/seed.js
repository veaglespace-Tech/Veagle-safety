import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Seed SuperAdmin Account
  const superAdminEmail = 'abhijeetambhore4@gmail.com';
  const passwordHash = await bcrypt.hash('Veagle@123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      fullName: 'Super Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
      isEmailVerified: true,
    },
    create: {
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
  console.log(`✅ [Seed] SuperAdmin Account Ready: ${superAdmin.email} (Password: Veagle@123)`);

  // 2. Seed Plans with Clean Numeric IDs (1, 2, 3)
  const plans = [
    {
      id: '1',
      name: 'Sakhi Suraksha 365 Yearly Protection Plan',
      description: 'Complete 365-Day 24/7 Unlimited SOS Emergency Broadcast, Live GPS Map Sharing, 5 Trusted Contacts Network, and HQ Command Dispatch',
      basePrice: 24.0,
      gstPercentage: 18.0,
      totalPrice: 28.32,
      durationDays: 365,
      isActive: true,
    },
    {
      id: '2',
      name: 'Sakhi Monthly Protection Plan',
      description: '30-Day Emergency SOS Broadcast, Live GPS Location Sharing, and Guardian Alerts',
      basePrice: 2.0,
      gstPercentage: 18.0,
      totalPrice: 2.36,
      durationDays: 30,
      isActive: true,
    },
    {
      id: '3',
      name: 'Sakhi Quarterly Protection Plan',
      description: '90-Day Emergency SOS Broadcast, Live GPS Location Sharing, and Guardian Alerts',
      basePrice: 6.0,
      gstPercentage: 18.0,
      totalPrice: 7.08,
      durationDays: 90,
      isActive: true,
    },
    {
      id: 'plan_yearly_24',
      name: 'Sakhi Suraksha 365 Yearly Protection Plan',
      description: 'Complete 365-Day 24/7 Unlimited SOS Emergency Broadcast, Live GPS Map Sharing, 5 Trusted Contacts Network, and HQ Command Dispatch',
      basePrice: 24.0,
      gstPercentage: 18.0,
      totalPrice: 28.32,
      durationDays: 365,
      isActive: true,
    },
  ];

  for (const planData of plans) {
    const p = await prisma.plan.upsert({
      where: { id: planData.id },
      update: planData,
      create: planData,
    });
    console.log(`✅ [Seed] Plan ID '${p.id}' Ready: ${p.name} (Base: ₹${p.basePrice}, Total: ₹${p.totalPrice})`);
  }

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
