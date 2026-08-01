import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import bcrypt from 'bcryptjs';

/**
 * Super Admin Command Center Overview
 */
export const getAdminOverview = asyncHandler(async (req, res) => {
  const activeSos = await prisma.sosSession.findMany({
    where: { status: 'ACTIVE' },
    include: {
      user: { select: { id: true, fullName: true, email: true, phone: true, profilePhoto: true } },
      locations: { orderBy: { recordedAt: 'desc' }, take: 1 },
      alerts: true,
    },
    orderBy: { startedAt: 'desc' },
  });

  const recentSos = await prisma.sosSession.findMany({
    take: 10,
    orderBy: { startedAt: 'desc' },
    include: {
      user: { select: { id: true, fullName: true, email: true, phone: true } },
    },
  });

  const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
  const activeSubscriptions = await prisma.user.count({ where: { subscriptionStatus: 'ACTIVE' } });

  // Calculate revenue statistics from SUCCESS payment transactions
  const successfulPayments = await prisma.paymentHistory.aggregate({
    where: { status: 'SUCCESS' },
    _sum: {
      amount: true,
      baseAmount: true,
      gstAmount: true,
    },
    _count: { id: true },
  });

  const gstSetting = await prisma.systemSetting.findUnique({ where: { key: 'GST_PERCENTAGE' } });
  const currentGstPercentage = gstSetting ? parseFloat(gstSetting.value) : 18.0;

  return res.json({
    metrics: {
      activeSosCount: activeSos.length,
      totalUsers,
      activeSubscriptions,
      totalRevenue: successfulPayments._sum.amount || 0,
      totalBaseRevenue: successfulPayments._sum.baseAmount || 0,
      totalGstCollected: successfulPayments._sum.gstAmount || 0,
      totalSuccessfulTransactions: successfulPayments._count.id || 0,
      currentGstPercentage,
      systemStatus: '100% OPERATIONAL',
    },
    activeSos,
    recentSos,
  });
});

/**
 * Fetch All Registered Users with Full Profile & Subscription Details
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      profilePhoto: true,
      bloodGroup: true,
      address: true,
      city: true,
      state: true,
      country: true,
      isEmailVerified: true,
      subscriptionStatus: true,
      subscriptionExpiresAt: true,
      safetyStatus: true,
      createdAt: true,
      _count: {
        select: {
          trustedContacts: true,
          sosSessions: true,
          journeys: true,
          paymentHistories: true,
        },
      },
    },
  });

  return res.json({ users });
});

/**
 * Update User Role (User <-> SuperAdmin)
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  if (!userId || !role || !['USER', 'SUPER_ADMIN'].includes(role)) {
    return res.status(400).json({ error: 'Invalid user ID or role parameter' });
  }

  const targetUserId = typeof userId === 'number' ? userId : parseInt(userId, 10);

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { role },
  });

  return res.json({
    message: `User ${updated.fullName} role updated to ${role}`,
    user: { id: updated.id, role: updated.role },
  });
});

/**
 * Update Full User Details by SuperAdmin (including Direct Email Change without OTP)
 */
export const updateUserDetailsAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    email,
    phone,
    role,
    bloodGroup,
    address,
    city,
    state,
    pincode,
    emergencyContactName,
    emergencyContactPhone,
    medicalNotes,
    password,
  } = req.body;

  const targetUserId = parseInt(id, 10);
  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) {
    return res.status(404).json({ error: 'User account not found' });
  }

  // Check email uniqueness if email is changed
  if (email && email.toLowerCase().trim() !== targetUser.email.toLowerCase().trim()) {
    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findFirst({
      where: { email: cleanEmail, id: { not: targetUserId } },
    });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists' });
    }
  }

  let passwordHash = undefined;
  if (password && password.length >= 6) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      ...(fullName && { fullName: fullName.trim() }),
      ...(email && { email: email.toLowerCase().trim(), isEmailVerified: true }),
      ...(phone && { phone: phone.replace(/\D/g, '') }),
      ...(role && { role }),
      ...(passwordHash && { passwordHash }),
      ...(bloodGroup !== undefined && { bloodGroup }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(pincode !== undefined && { pincode }),
      ...(emergencyContactName !== undefined && { emergencyContactName }),
      ...(emergencyContactPhone !== undefined && { emergencyContactPhone }),
      ...(medicalNotes !== undefined && { medicalNotes }),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      bloodGroup: true,
      address: true,
      city: true,
      state: true,
      pincode: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      medicalNotes: true,
      subscriptionStatus: true,
      subscriptionExpiresAt: true,
      safetyStatus: true,
    },
  });

  return res.json({
    message: `User details updated successfully for ${updatedUser.fullName}`,
    user: updatedUser,
  });
});

/**
 * Toggle User Account Block / Unblock Status by SuperAdmin
 */
export const toggleUserBlock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const targetUserId = parseInt(id, 10);

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) {
    return res.status(404).json({ error: 'User account not found' });
  }

  const isBlocked = targetUser.safetyStatus === 'BLOCKED';
  const newSafetyStatus = isBlocked ? 'SAFE' : 'BLOCKED';

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { safetyStatus: newSafetyStatus },
    select: { id: true, fullName: true, safetyStatus: true },
  });

  return res.json({
    message: `User ${updated.fullName} is now ${newSafetyStatus === 'BLOCKED' ? 'BLOCKED' : 'UNBLOCKED'}`,
    user: updated,
  });
});

/**
 * Grant Free Custom Subscription Plan / Renewal by SuperAdmin
 */
export const grantUserFreeSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { durationDays, customStartDate, customExpiryDate, planName } = req.body;
  const targetUserId = parseInt(id, 10);

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) {
    return res.status(404).json({ error: 'User account not found' });
  }

  let startDate = customStartDate ? new Date(customStartDate) : new Date();
  let expiryDate = customExpiryDate ? new Date(customExpiryDate) : new Date(startDate.getTime() + (durationDays || 365) * 24 * 60 * 60 * 1000);

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      subscriptionStatus: 'ACTIVE',
      subscriptionExpiresAt: expiryDate,
    },
    select: {
      id: true,
      fullName: true,
      subscriptionStatus: true,
      subscriptionExpiresAt: true,
    },
  });

  // Record free grant in payment history for audit logging
  try {
    await prisma.paymentHistory.create({
      data: {
        userId: targetUserId,
        txnid: `SUPERADMIN_GRANT_${Date.now()}_${targetUserId}`,
        amount: 0.0,
        baseAmount: 0.0,
        gstAmount: 0.0,
        gstPercentage: 0.0,
        status: 'SUCCESS',
        paymentMode: 'SUPERADMIN_FREE_GRANT',
      },
    });
  } catch (e) {}

  return res.json({
    message: `Free Subscription (${planName || 'Custom Plan'}) granted to ${updatedUser.fullName} valid until ${expiryDate.toLocaleDateString('en-IN')}`,
    user: updatedUser,
  });
});

/**
 * Toggle Subscription Plan Active Status
 */
export const togglePlanActive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const targetPlanId = parseInt(id, 10);

  const targetPlan = await prisma.plan.findUnique({ where: { id: targetPlanId } });
  if (!targetPlan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  const updated = await prisma.plan.update({
    where: { id: targetPlanId },
    data: { isActive: !targetPlan.isActive },
  });

  return res.json({
    message: `Plan "${updated.name}" is now ${updated.isActive ? 'ENABLED' : 'DISABLED'}`,
    plan: updated,
  });
});

/**
 * Resolve Active SOS Session by SuperAdmin
 */
export const adminResolveSos = asyncHandler(async (req, res) => {
  const { sosSessionId, note } = req.body;

  const targetSosId = typeof sosSessionId === 'number' ? sosSessionId : parseInt(sosSessionId, 10);

  const sos = await prisma.sosSession.update({
    where: { id: targetSosId },
    data: {
      status: 'RESOLVED',
      resolvedAt: new Date(),
      resolutionNote: note || 'Resolved by Super Admin Command Center',
    },
  });

  await prisma.user.update({
    where: { id: sos.userId },
    data: { safetyStatus: 'SAFE' },
  });

  return res.json({ message: 'Emergency session resolved by Super Admin', sos });
});

/**
 * Manage Subscription Plans (Get All Plans)
 */
export const getPlans = asyncHandler(async (req, res) => {
  let plans = await prisma.plan.findMany({ orderBy: { createdAt: 'desc' } });

  // If no plans exist, create default 24 INR + GST plan
  if (plans.length === 0) {
    const defaultPlan = await prisma.plan.create({
      data: {
        name: 'Sakhi Suraksha 365 Yearly Protection Plan',
        description: 'Complete 365-Day 24/7 Unlimited SOS Emergency Broadcast, Live GPS Map Sharing, 5 Trusted Contacts Network, and HQ Command Dispatch',
        basePrice: 24.0,
        gstPercentage: 18.0,
        totalPrice: 28.32,
        durationDays: 365,
        isActive: true,
      },
    });
    plans = [defaultPlan];
  }

  return res.json({ plans });
});

/**
 * Create or Update Subscription Plan
 */
export const createOrUpdatePlan = asyncHandler(async (req, res) => {
  const { id, name, description, basePrice, gstPercentage, durationDays, isActive } = req.body;

  if (!name || basePrice === undefined) {
    return res.status(400).json({ error: 'Plan name and basePrice are required' });
  }

  const gst = gstPercentage !== undefined ? parseFloat(gstPercentage) : 18.0;
  const base = parseFloat(basePrice);
  const total = parseFloat((base + (base * gst) / 100).toFixed(2));

  let plan;
  if (id) {
    const targetPlanId = typeof id === 'number' ? id : parseInt(id, 10);
    plan = await prisma.plan.update({
      where: { id: targetPlanId },
      data: {
        name,
        description,
        basePrice: base,
        gstPercentage: gst,
        totalPrice: total,
        durationDays: durationDays || 30,
        isActive: isActive !== undefined ? isActive : true,
      },
    });
  } else {
    plan = await prisma.plan.create({
      data: {
        name,
        description,
        basePrice: base,
        gstPercentage: gst,
        totalPrice: total,
        durationDays: durationDays || 30,
        isActive: isActive !== undefined ? isActive : true,
      },
    });
  }

  return res.json({ message: 'Subscription plan saved successfully', plan });
});

/**
 * Get Dynamic System GST Settings
 */
export const getGstSettings = asyncHandler(async (req, res) => {
  const setting = await prisma.systemSetting.findUnique({ where: { key: 'GST_PERCENTAGE' } });
  const gstPercentage = setting ? parseFloat(setting.value) : 18.0;

  return res.json({ gstPercentage });
});

/**
 * Update Dynamic GST Percentage Settings
 */
export const updateGstSettings = asyncHandler(async (req, res) => {
  const { gstPercentage } = req.body;

  if (gstPercentage === undefined || isNaN(parseFloat(gstPercentage))) {
    return res.status(400).json({ error: 'Valid gstPercentage number is required' });
  }

  const gstValue = parseFloat(gstPercentage).toString();

  const setting = await prisma.systemSetting.upsert({
    where: { key: 'GST_PERCENTAGE' },
    update: { value: gstValue },
    create: { key: 'GST_PERCENTAGE', value: gstValue },
  });

  return res.json({
    message: 'Global GST percentage updated successfully',
    gstPercentage: parseFloat(setting.value),
  });
});

/**
 * Get Complete Payment History Transactions & Reports for SuperAdmin
 */
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await prisma.paymentHistory.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
      plan: true,
    },
  });

  const totals = payments.reduce(
    (acc, item) => {
      if (item.status === 'SUCCESS') {
        acc.totalRevenue += item.amount;
        acc.totalBaseAmount += item.baseAmount;
        acc.totalGstCollected += item.gstAmount;
        acc.successCount += 1;
      } else if (item.status === 'FAILED') {
        acc.failedCount += 1;
      } else {
        acc.pendingCount += 1;
      }
      return acc;
    },
    { totalRevenue: 0, totalBaseAmount: 0, totalGstCollected: 0, successCount: 0, failedCount: 0, pendingCount: 0 }
  );

  return res.json({
    summary: totals,
    payments,
  });
});

/**
 * Super Admin Create User Directly
 */
export const createUserByAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role, bloodGroup } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Full name, email, and password are required.' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      fullName,
      email,
      phone: phone || '+91 90000 00000',
      passwordHash,
      role: role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'USER',
      bloodGroup: bloodGroup || 'O+',
      isEmailVerified: true,
      onboardingStep: 7,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      bloodGroup: true,
      createdAt: true,
    },
  });

  return res.status(201).json({
    message: `Account created successfully for ${newUser.fullName} (${newUser.role})`,
    user: newUser,
  });
});

/**
 * Update Super Admin Profile Details
 */
export const updateSuperAdminProfile = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  const adminId = req.user.id;

  const updateData = {};
  if (fullName) updateData.fullName = fullName;
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;
  if (password && password.length >= 6) {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  const updatedAdmin = await prisma.user.update({
    where: { id: adminId },
    data: updateData,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      profilePhoto: true,
    },
  });

  return res.json({
    message: 'Super Admin profile updated successfully',
    user: updatedAdmin,
  });
});
