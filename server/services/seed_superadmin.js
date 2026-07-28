import { prisma } from '../config/prisma.js';
import bcrypt from 'bcryptjs';

export async function seedSuperAdminData() {
  try {
    const email = process.env.SUPER_ADMIN_EMAIL || 'admin@veaglesafety.org';
    const fullName = 'Super Admin';
    const passwordHash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'Veagle@123', 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        fullName,
        passwordHash,
        role: 'SUPER_ADMIN',
        isEmailVerified: true,
      },
      create: {
        fullName,
        email,
        phone: '+91 90000 00000',
        passwordHash,
        role: 'SUPER_ADMIN',
        isEmailVerified: true,
        onboardingStep: 7,
      },
    });
    console.log(`[Seed] Super Admin account ready: ${user.email} (Role: ${user.role})`);
    return user;
  } catch (err) {
    console.error('[Seed Error]:', err.message);
  }
}

if (process.argv[1] && process.argv[1].includes('seed_superadmin.js')) {
  seedSuperAdminData().then(() => prisma.$disconnect());
}
