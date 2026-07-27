import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const startCheckin = async (req: AuthRequest, res: Response) => {
  try {
    const { intervalMins } = req.body;
    const mins = parseInt(intervalMins, 10) || 15;
    const triggerAt = new Date(Date.now() + mins * 60 * 1000);

    const checkin = await prisma.safetyCheckin.create({
      data: {
        userId: req.user!.id,
        intervalMins: mins,
        triggerAt,
        status: 'PENDING',
      },
    });

    return res.status(201).json({ message: 'Safety timer started', checkin });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to start safety check-in timer' });
  }
};

export const confirmCheckinSafe = async (req: AuthRequest, res: Response) => {
  try {
    const { checkinId } = req.body;

    await prisma.safetyCheckin.update({
      where: { id: checkinId },
      data: { status: 'CONFIRMED_SAFE' },
    });

    return res.json({ message: 'Safety check confirmed!' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to confirm safety check' });
  }
};

export const getActiveCheckin = async (req: AuthRequest, res: Response) => {
  try {
    const checkin = await prisma.safetyCheckin.findFirst({
      where: { userId: req.user!.id, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ checkin });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch checkin state' });
  }
};
