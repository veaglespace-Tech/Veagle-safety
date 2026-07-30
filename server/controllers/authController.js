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
    // USER requires all essential details
    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !bloodGroup ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !emergencyContactName ||
      !emergencyContactPhone
    ) {
      return res.status(400).json({
        error: 'Please fill in all required fields: Full Name, Email, Mobile Number, Password, Blood Group, Address, City, State, Pincode, Guardian Name, and Guardian Phone.',
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Mobile number validation (10 digits Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.' });
    }

    const cleanEmergencyPhone = emergencyContactPhone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanEmergencyPhone)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number for Emergency Guardian Contact.' });
    }

    // Pincode validation (6 digits)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode.trim())) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit Pincode.' });
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

  // For USER role: Defer DB insertion until full flow (payment completion)
  if (assignedRole === 'USER') {
    const pendingRegistrationToken = jwt.sign(
      {
        fullName,
        email,
        phone,
        passwordHash,
        role: 'USER',
        profilePhoto: profilePhoto || 'https://ik.imagekit.io/m5ei0wbuw/avatar-woman-1.png',
        bloodGroup,
        address,
        city,
        state,
        country: country || 'India',
        pincode,
        emergencyContactName,
        emergencyContactPhone,
        medicalNotes: medicalNotes || null,
        otp,
        otpExpiresAt: otpExpires.getTime(),
        type: 'PENDING_REGISTRATION',
      },
      config.jwt.secret,
      { expiresIn: '2h' }
    );

    try {
      await sendEmailVerificationOtp({ recipientEmail: email, userName: fullName, otp });
    } catch (emailErr) {
      console.warn('[Register Email Notice] Verification email notice:', emailErr.message);
    }

    return res.status(200).json({
      message: 'OTP code sent to your email. Please verify to proceed to plan formalities.',
      requiresVerification: true,
      pendingToken: pendingRegistrationToken,
      email,
    });
  }

  // SuperAdmin gets immediate DB creation & JWT login
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
      isEmailVerified: true,
    },
  });

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
 * Verify Email Verification OTP (Without DB insertion for pending users)
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp, pendingToken } = req.body;

  if (!otp) {
    return res.status(400).json({ error: '6-digit OTP code is required' });
  }

  // Case 1: Check existing DB user (for resend OTP / existing users)
  const existingUser = email ? await prisma.user.findUnique({ where: { email } }) : null;
  if (existingUser) {
    if (existingUser.isEmailVerified) {
      const token = jwt.sign(
        { id: existingUser.id, userId: existingUser.id, role: existingUser.role, email: existingUser.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      return res.status(200).json({
        message: 'Email is already verified',
        token,
        user: {
          id: existingUser.id,
          fullName: existingUser.fullName,
          email: existingUser.email,
          phone: existingUser.phone,
          role: existingUser.role,
          subscriptionStatus: existingUser.subscriptionStatus,
        },
      });
    }

    if (existingUser.emailOtp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP code. Please check your email and try again.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: { isEmailVerified: true, emailOtp: null, emailOtpExpiresAt: null },
    });

    const token = jwt.sign(
      { id: updatedUser.id, userId: updatedUser.id, role: updatedUser.role, email: updatedUser.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return res.status(200).json({
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
  }

  // Case 2: Pending registration token verification (NO DB insertion yet)
  if (!pendingToken) {
    return res.status(400).json({ error: 'Registration session expired. Please register again.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(pendingToken, config.jwt.secret);
  } catch (err) {
    return res.status(400).json({ error: 'Registration session expired or invalid. Please try registering again.' });
  }

  if (decoded.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP code. Please check your email and try again.' });
  }

  if (decoded.otpExpiresAt && Date.now() > decoded.otpExpiresAt) {
    return res.status(400).json({ error: 'OTP code has expired. Please click Resend OTP.' });
  }

  // Issue a verified registration token to be passed to Checkout and PayU
  const { exp, iat, ...cleanPayload } = decoded;
  const registrationToken = jwt.sign(
    {
      ...cleanPayload,
      isEmailVerified: true,
      type: 'VERIFIED_REGISTRATION',
    },
    config.jwt.secret,
    { expiresIn: '2h' }
  );

  res.status(200).json({
    message: 'Email verified successfully! Please select your plan and complete payment to activate account.',
    registrationToken,
    user: {
      fullName: decoded.fullName,
      email: decoded.email,
      phone: decoded.phone,
      role: decoded.role,
      bloodGroup: decoded.bloodGroup,
      address: decoded.address,
      city: decoded.city,
      state: decoded.state,
      pincode: decoded.pincode,
      emergencyContactName: decoded.emergencyContactName,
      emergencyContactPhone: decoded.emergencyContactPhone,
      subscriptionStatus: 'INACTIVE',
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
    // Auto-send fresh OTP on login attempt for unverified account
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { emailOtp: newOtp, emailOtpExpiresAt: otpExpires },
    });

    console.log(`🔑 [OTP RESENT on Login] Email: ${user.email} | OTP: ${newOtp}`);

    try {
      await sendEmailVerificationOtp({ recipientEmail: user.email, userName: user.fullName, otp: newOtp });
    } catch (e) {
      console.warn('[Login OTP Email Notice]', e.message);
    }

    return res.status(403).json({
      error: 'Your email is not verified. A new OTP has been sent to your email.',
      requiresVerification: true,
      email: user.email,
    });
  }


  const token = jwt.sign(
    { id: user.id, userId: user.id, role: user.role, email: user.email },
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

