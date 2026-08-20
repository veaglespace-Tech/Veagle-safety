import { jest } from '@jest/globals';
import { startSos, resolveSos } from '../sosController.js';
import { prisma } from '../../config/prisma.js';

jest.mock('../../config/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    sosSession: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    sosLocation: {
      create: jest.fn(),
    },
    trustedContact: {
      findMany: jest.fn(),
    },
    parentChildLink: {
      findMany: jest.fn(),
    },
    organizationMember: {
      findMany: jest.fn(),
    }
  },
}));

jest.mock('../../services/mailer.js', () => ({
  sendSosEmergencyAlert: jest.fn(),
  sendSosSafeAlert: jest.fn(),
}));

jest.mock('../pushController.js', () => ({
  sendEmergencyPushToEmails: jest.fn(),
}));

jest.mock('../../socket.js', () => ({
  getIO: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  })),
}));

describe('SosController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 1 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('startSos', () => {
    it('should start SOS successfully', async () => {
      req.body = { initialLat: 18.5204, initialLng: 73.8567, isSilent: false };

      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
      });

      prisma.sosSession.findFirst.mockResolvedValue(null);
      prisma.sosSession.create.mockResolvedValue({
        id: 10,
        userId: 1,
        shareToken: 'test-token',
        isSilent: false,
      });

      prisma.sosLocation.create.mockResolvedValue({});
      prisma.user.update.mockResolvedValue({});
      prisma.trustedContact.findMany.mockResolvedValue([
        { id: 1, name: 'Contact 1', phone: '9876543210', email: 'contact1@example.com' },
      ]);
      prisma.parentChildLink.findMany.mockResolvedValue([]);
      prisma.organizationMember.findMany.mockResolvedValue([]);

      await startSos(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('SOS Activated'),
        })
      );
    });
  });

  describe('resolveSos', () => {
    it('should resolve SOS successfully', async () => {
      req.body = { sosSessionId: 10 };
      
      prisma.sosSession.findUnique.mockResolvedValue({
        id: 10,
        userId: 1,
      });
      
      prisma.sosSession.update.mockResolvedValue({
        id: 10,
        userId: 1,
        status: 'RESOLVED',
        resolvedAt: new Date(),
        user: { fullName: 'Test User' },
        locations: [{ latitude: 18.5204, longitude: 73.8567 }],
      });

      await resolveSos(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('SOS session resolved safely'),
        })
      );
    });
  });
});
