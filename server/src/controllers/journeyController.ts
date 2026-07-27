import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

export const startJourney = async (req: AuthRequest, res: Response) => {
  try {
    const { originName, destinationName, originLat, originLng, destLat, destLng, minutesToArrive } = req.body;

    const expectedArrival = new Date(Date.now() + (parseInt(minutesToArrive, 10) || 30) * 60 * 1000);
    const shareToken = crypto.randomBytes(16).toString('hex');

    const journey = await prisma.journey.create({
      data: {
        userId: req.user!.id,
        originName: originName || 'Current Location',
        destinationName,
        originLat: parseFloat(originLat || 0),
        originLng: parseFloat(originLng || 0),
        destLat: parseFloat(destLat || 0),
        destLng: parseFloat(destLng || 0),
        expectedArrival,
        shareToken,
        status: 'IN_PROGRESS',
      },
    });

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { safetyStatus: 'JOURNEY_ACTIVE' },
    });

    return res.status(201).json({ message: 'Protected journey started', journey });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to start protected journey' });
  }
};

export const completeJourney = async (req: AuthRequest, res: Response) => {
  try {
    const { journeyId } = req.body;

    await prisma.journey.update({
      where: { id: journeyId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { safetyStatus: 'SAFE' },
    });

    return res.json({ message: 'Journey marked as completed safely!' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to complete journey' });
  }
};

export const getActiveJourney = async (req: AuthRequest, res: Response) => {
  try {
    const journey = await prisma.journey.findFirst({
      where: { userId: req.user!.id, status: 'IN_PROGRESS' },
      orderBy: { startedAt: 'desc' },
    });
    return res.json({ journey });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch active journey' });
  }
};
