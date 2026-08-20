import { jest } from '@jest/globals';
import { register, login } from '../authController.js';
import { prisma } from '../../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../config/prisma.js', () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('../../services/mailer.js', () => ({
  sendEmailVerificationOtp: jest.fn(),
  sendWelcomeEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 401 if user not found', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      prisma.user.findFirst.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email/phone or password' });
    });

    it('should return 401 if password is invalid', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      prisma.user.findFirst.mockResolvedValue({ id: 1, passwordHash: 'hash', role: 'USER' });
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
    });

    it('should login successfully for verified user', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hash',
        role: 'USER',
        isEmailVerified: true,
      };
      prisma.user.findFirst.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mocked_token');

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Logged in successfully',
          token: 'mocked_token',
        })
      );
    });
  });

  describe('register', () => {
    it('should return 400 for invalid email', async () => {
      req.body = { email: 'invalid', phone: '9876543210' };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining('valid email address') });
    });
  });
});
