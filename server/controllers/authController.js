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
    pincode,
    emergencyContactName,
    emergencyContactPhone,
    medicalNotes,
  } = req.body;

  const assignedRole = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'USER';

  // Field Validations
  if (assignedRole === 'SUPER_ADMIN') {
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'fullName, email, and password are required for SuperAdmin' });
    }
  } else {
    // USER requires essential details (Name, Email, Phone, Password)
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        error: 'Please fill in all required fields: Full Name, Email, Phone Number, and Password.',
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
      phone: phone || '+91 98765 43210',
      passwordHash,
      role: assignedRole,
      profilePhoto: profilePhoto || 'https://ik.imagekit.io/m5ei0wbuw/avatar-woman-1.png',
      bloodGroup: bloodGroup || 'O+',
      address: address || 'Not Specified',
      city: city || 'Pune',
      state: state || 'Maharashtra',
      country: country || 'India',
      pincode: pincode || '411001',
      emergencyContactName: emergencyContactName || null,
      emergencyContactPhone: emergencyContactPhone || null,
      medicalNotes: medicalNotes || null,
      isEmailVerified: assignedRole === 'SUPER_ADMIN' ? true : false,
      emailOtp: assignedRole === 'SUPER_ADMIN' ? null : otp,
      emailOtpExpiresAt: assignedRole === 'SUPER_ADMIN' ? null : otpExpires,
    },
  });

  // Automatically create primary emergency contact in TrustedContact table if provided
  if (emergencyContactName && emergencyContactPhone) {
    try {
      await prisma.trustedContact.create({
        data: {
          userId: user.id,
          name: emergencyContactName,
          relationship: 'Primary Guardian / Emergency Contact',
          phone: emergencyContactPhone,
          email: email, // Default backup notification email
          isVerified: true,
          priorityOrder: 1,
        },
      });
    } catch (e) {
      console.log('[Register Notice] Optional primary contact creation skipped:', e.message);
    }
  }

  // Send verification email for User role
  if (assignedRole === 'USER') {
    try {
      await sendEmailVerificationOtp({ recipientEmail: email, userName: fullName, otp });
    } catch (emailErr) {
      console.warn('[Register Email Notice] Verification email notice:', emailErr.message);
    }

    return res.status(201).json({
      message: 'Account created successfully! Please enter the 6-digit OTP code sent to your email to complete registration.',
      requiresVerification: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
      },
    });
  }

  // SuperAdmin gets immediate JWT login
  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  res.status(201).json({
    message: 'SuperAdmin account registered successfully',
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
    },
  });
});

/**
 * Verify Email Verification OTP
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and 6-digit OTP code are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User account not found' });
  }

  if (user.isEmailVerified) {
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    return res.status(200).json({
      message: 'Email is already verified',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
      },
    });
  }

  if (user.emailOtp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP code. Please check your email and try again.' });
  }

  if (user.emailOtpExpiresAt && new Date() > new Date(user.emailOtpExpiresAt)) {
    return res.status(400).json({ error: 'OTP code has expired. Please click Resend OTP.' });
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
    { userId: updatedUser.id, role: updatedUser.role, email: updatedUser.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  res.status(200).json({
    message: 'Email verified successfully!',
    token,
    user: {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
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
    return res.status(400).json({ error: 'Email address is required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User account not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ error: 'Email is already verified' });
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const newOtpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailOtp: newOtp,
      emailOtpExpiresAt: newOtpExpires,
    },
  });

  try {
    await sendEmailVerificationOtp({ recipientEmail: email, userName: user.fullName, otp: newOtp });
  } catch (emailErr) {
    console.warn('[Resend OTP Email Notice] Failed to send email:', emailErr.message);
  }

  res.status(200).json({
    message: 'A new 6-digit OTP code has been sent to your email address.',
  });
});

/**
 * Login User / SuperAdmin
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email address and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (!user.isEmailVerified && user.role === 'USER') {
    return res.status(403).json({
      error: 'Please verify your email address to log in.',
      requiresVerification: true,
      email: user.email,
    });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  res.status(200).json({
    message: 'Logged in successfully',
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
      profilePhoto: user.profilePhoto,
      bloodGroup: user.bloodGroup,
    },
  });
});

/**
 * Get Profile of Logged-in User
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      subscriptionStatus: true,
      profilePhoto: true,
      bloodGroup: true,
      address: true,
      city: true,
      state: true,
      country: true,
      pincode: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      medicalNotes: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  res.status(200).json({ user });
});

/**
 * Update Profile Settings
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    profilePhoto,
    bloodGroup,
    address,
    city,
    state,
    country,
    pincode,
    emergencyContactName,
    emergencyContactPhone,
    medicalNotes,
  } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(fullName && { fullName }),
      ...(phone && { phone }),
      ...(profilePhoto !== undefined && { profilePhoto }),
      ...(bloodGroup !== undefined && { bloodGroup }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(country !== undefined && { country }),
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
      subscriptionStatus: true,
      profilePhoto: true,
      bloodGroup: true,
      address: true,
      city: true,
      state: true,
      country: true,
      pincode: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      medicalNotes: true,
    },
  });

  res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
});

/**
 * Logout User
 */
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

