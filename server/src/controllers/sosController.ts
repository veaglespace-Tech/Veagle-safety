import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { sendEmergencyEmail } from '../services/mailer';
import { config } from '../config';

export const startSos = async (req: AuthRequest, res: Response) => {
  try {
    const { isSilent, initialLat, initialLng } = req.body;
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { trustedContacts: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Mark active existing sessions as cancelled
    await prisma.sosSession.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'CANCELLED', resolvedAt: new Date() },
    });

    const sosSession = await prisma.sosSession.create({
      data: {
        userId,
        isSilent: Boolean(isSilent),
        status: 'ACTIVE',
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { safetyStatus: 'SOS_ACTIVE' },
    });

    if (initialLat && initialLng) {
      await prisma.sosLocation.create({
        data: {
          sosSessionId: sosSession.id,
          latitude: parseFloat(initialLat),
          longitude: parseFloat(initialLng),
        },
      });
    }

    const trackingUrl = `${config.clientUrl}/track/${sosSession.shareToken}`;

    // Send emails asynchronously
    user.trustedContacts.forEach(async (contact) => {
      if (contact.email) {
        await sendEmergencyEmail(
          contact.email,
          contact.name,
          user.fullName,
          user.phone,
          trackingUrl,
          Boolean(isSilent)
        );

        await prisma.sosAlert.create({
          data: {
            sosSessionId: sosSession.id,
            channel: 'EMAIL',
            recipient: contact.email,
            status: 'SENT',
          },
        });
      }
    });

    return res.status(201).json({
      message: 'SOS session activated',
      sosSession: {
        id: sosSession.id,
        shareToken: sosSession.shareToken,
        startedAt: sosSession.startedAt,
        isSilent: sosSession.isSilent,
        trackingUrl,
      },
    });
  } catch (error) {
    console.error('Start SOS error:', error);
    return res.status(500).json({ error: 'Failed to trigger emergency SOS' });
  }
};

export const updateSosLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { sosSessionId, latitude, longitude, accuracy } = req.body;

    const location = await prisma.sosLocation.create({
      data: {
        sosSessionId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        accuracy: accuracy ? parseFloat(accuracy) : null,
      },
    });

    return res.json({ message: 'Location updated', location });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to record location update' });
  }
};

export const resolveSos = async (req: AuthRequest, res: Response) => {
  try {
    const { sosSessionId } = req.body;
    const userId = req.user!.id;

    await prisma.sosSession.update({
      where: { id: sosSessionId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolutionNote: 'User marked self as SAFE',
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { safetyStatus: 'SAFE' },
    });

    return res.json({ message: 'Emergency session ended. You are marked as safe.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to resolve emergency session' });
  }
};

export const getPublicSosTracking = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const session = await prisma.sosSession.findUnique({
      where: { shareToken: token },
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
            trustedContacts: { select: { name: true, phone: true } },
          },
        },
        locations: {
          orderBy: { recordedAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Live tracking session not found or link expired.' });
    }

    return res.json({ session });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching live tracking state' });
  }
};

export const getActiveSosSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await prisma.sosSession.findFirst({
      where: { userId: req.user!.id, status: 'ACTIVE' },
      include: {
        locations: {
          orderBy: { recordedAt: 'desc' },
          take: 10,
        },
      },
    });
    return res.json({ session });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch active SOS session' });
  }
};
