import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { config } from '../config/index.js';

export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'USER';

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        role: assignedRole,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        safetyStatus: user.safetyStatus,
        quickSosMode: user.quickSosMode,
        onboardingStep: user.onboardingStep,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
};

export const login = async (req, res) => {
  try {
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
        safetyStatus: user.safetyStatus,
        quickSosMode: user.quickSosMode,
        onboardingStep: user.onboardingStep,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: {
        trustedContacts: true,
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
        safetyStatus: user.safetyStatus,
        quickSosMode: user.quickSosMode,
        onboardingStep: user.onboardingStep,
        trustedContactsCount: user.trustedContacts.length,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { quickSosMode, onboardingStep } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user?.id },
      data: {
        ...(quickSosMode && { quickSosMode }),
        ...(onboardingStep && { onboardingStep }),
      },
    });

    return res.json({
      message: 'Settings updated',
      user: {
        id: updated.id,
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        safetyStatus: updated.safetyStatus,
        quickSosMode: updated.quickSosMode,
        onboardingStep: updated.onboardingStep,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update settings' });
  }
};
