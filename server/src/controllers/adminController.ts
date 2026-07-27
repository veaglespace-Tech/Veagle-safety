import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getAdminOverview = async (req: Request, res: Response) => {
  try {
    const activeSos = await prisma.sosSession.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        locations: { orderBy: { recordedAt: 'desc' }, take: 1 },
        alerts: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    const recentSos = await prisma.sosSession.findMany({
      take: 20,
      orderBy: { startedAt: 'desc' },
      include: {
        user: { select: { fullName: true } },
      },
    });

    const userCount = await prisma.user.count();
    const activeJourneysCount = await prisma.journey.count({ where: { status: 'IN_PROGRESS' } });

    return res.json({
      metrics: {
        activeSosCount: activeSos.length,
        totalUsers: userCount,
        activeJourneysCount,
        systemStatus: 'OPERATIONAL',
      },
      activeSos,
      recentSos,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load admin overview' });
  }
};
