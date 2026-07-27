import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { config } from '../config/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { sendEmailVerificationOtp } from '../services/mailer.js';

/**
 * Register User / SuperAdmin with Email Verification OTP
 */
export const register = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    password,
    role,
    profilePhoto,
    bloodGroup,
    address,
    city,
    state,
    country,
  } = req.body;

  const assignedRole = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'USER';

  // Field Validations
  if (assignedRole === 'SUPER_ADMIN') {
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'fullName, email, and password are required for SuperAdmin' });
    }
  } else {
    // USER requires all profile details
    if (!fullName || !email || !phone || !password || !profilePhoto || !bloodGroup || !address || !city || !state || !country) {
      return res.status(400).json({
        error: 'All fields are required: fullName, email, phone, password, profilePhoto, bloodGroup, address, city, state, country',
      });
    }
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Generate 6-digit Email Verification OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone: phone || '+91 00000 00000',
      passwordHash,
      role: assignedRole,
      profilePhoto: profilePhoto || null,
      bloodGroup: bloodGroup || null,
      address: address || null,
      city: city || null,
      state: state || null,
      country: country || null,
      isEmailVerified: assignedRole === 'SUPER_ADMIN' ? true : false,
      emailOtp: assignedRole === 'SUPER_ADMIN' ? null : otp,
      emailOtpExpiresAt: assignedRole === 'SUPER_ADMIN' ? null : otpExpires,
    },
  });

  // Send verification email for User role
  if (assignedRole === 'USER') {
    await sendEmailVerificationOtp({ recipientEmail: email, userName: fullName, otp });
  }

  return res.status(201).json({
    message: assignedRole === 'USER'
      ? 'Registration successful. A 6-digit verification code has been sent to your email.'
      : 'SuperAdmin account created successfully.',
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
  });
});

/**
 * Verify Email OTP Endpoint
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP code are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ message: 'Email is already verified' });
  }

  if (!user.emailOtp || user.emailOtp !== otp) {
    return res.status(400).json({ error: 'Invalid verification OTP code' });
  }

  if (user.emailOtpExpiresAt && new Date() > new Date(user.emailOtpExpiresAt)) {
    return res.status(400).json({ error: 'Verification OTP has expired. Please request a new code.' });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailOtp: null,
      emailOtpExpiresAt: null,
    },
  });

  const token = jwt.sign(
    { id: updatedUser.id, email: updatedUser.email, fullName: updatedUser.fullName, role: updatedUser.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  return res.json({
    message: 'Email verified successfully',
    token,
    user: {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      isEmailVerified: true,
      subscriptionStatus: updatedUser.subscriptionStatus,
    },
  });
});

/**
 * Resend Email Verification OTP
 */
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User account not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ message: 'Email is already verified' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailOtp: otp,
      emailOtpExpiresAt: otpExpires,
    },
  });

  await sendEmailVerificationOtp({ recipientEmail: email, userName: user.fullName, otp });

  return res.json({ message: 'A new verification OTP code has been sent to your email.' });
});

/**
 * User / SuperAdmin Login (Signin)
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.role === 'USER' && !user.isEmailVerified) {
    return res.status(403).json({
      error: 'Email is not verified. Please verify your email OTP before logging in.',
      requiresVerification: true,
      email: user.email,
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  return res.json({
    message: 'Logged in successfully',
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePhoto: user.profilePhoto,
      bloodGroup: user.bloodGroup,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      isEmailVerified: user.isEmailVerified,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
      safetyStatus: user.safetyStatus,
      quickSosMode: user.quickSosMode,
      onboardingStep: user.onboardingStep,
    },
  });
});

/**
 * Signout / Logout Endpoint
 */
export const logout = asyncHandler(async (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * Get Authenticated User Profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    include: {
      trustedContacts: true,
      paymentHistories: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePhoto: user.profilePhoto,
      bloodGroup: user.bloodGroup,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      isEmailVerified: user.isEmailVerified,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
      safetyStatus: user.safetyStatus,
      quickSosMode: user.quickSosMode,
      onboardingStep: user.onboardingStep,
      trustedContacts: user.trustedContacts,
      paymentHistories: user.paymentHistories,
    },
  });
});

/**
 * Update User Profile & Settings
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const { quickSosMode, onboardingStep, fullName, phone, profilePhoto, bloodGroup, address, city, state, country } = req.body;

  const updated = await prisma.user.update({
    where: { id: req.user?.id },
    data: {
      ...(quickSosMode && { quickSosMode }),
      ...(onboardingStep && { onboardingStep }),
      ...(fullName && { fullName }),
      ...(phone && { phone }),
      ...(profilePhoto && { profilePhoto }),
      ...(bloodGroup && { bloodGroup }),
      ...(address && { address }),
      ...(city && { city }),
      ...(state && { state }),
      ...(country && { country }),
    },
  });

  return res.json({
    message: 'Profile updated successfully',
    user: updated,
  });
});
