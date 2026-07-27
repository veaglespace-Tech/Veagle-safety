import { prisma } from '../config/prisma.js';

export const getAdminOverview = async (req, res) => {
  try {
    const activeSos = await prisma.sosSession.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
        locations: { orderBy: { recordedAt: 'desc' }, take: 1 },
        alerts: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    const recentSos = await prisma.sosSession.findMany({
      take: 20,
      orderBy: { startedAt: 'desc' },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
      },
    });

    const totalUsers = await prisma.user.count();
    const superAdminsCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
    const activeJourneysCount = await prisma.journey.count({ where: { status: 'IN_PROGRESS' } });
    const pendingCheckinsCount = await prisma.safetyCheckin.count({ where: { status: 'PENDING' } });

    return res.json({
      metrics: {
        activeSosCount: activeSos.length,
        totalUsers,
        superAdminsCount,
        activeJourneysCount,
        pendingCheckinsCount,
        systemStatus: '100% OPERATIONAL',
        dispatchServer: 'ONLINE (SOCKET.IO ACTIVE)',
      },
      activeSos,
      recentSos,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load admin overview' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        safetyStatus: true,
        onboardingStep: true,
        createdAt: true,
        _count: {
          select: {
            trustedContacts: true,
            sosSessions: true,
            journeys: true,
          },
        },
      },
    });

    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user list' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role || !['USER', 'SUPER_ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid user ID or role parameter' });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return res.json({
      message: `User ${updated.fullName} role updated to ${role}`,
      user: {
        id: updated.id,
        role: updated.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user role' });
  }
};

export const adminResolveSos = async (req, res) => {
  try {
    const { sosSessionId, note } = req.body;

    const sos = await prisma.sosSession.update({
      where: { id: sosSessionId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolutionNote: note || 'Resolved by Super Admin Command Center',
      },
    });

    await prisma.user.update({
      where: { id: sos.userId },
      data: { safetyStatus: 'SAFE' },
    });

    return res.json({ message: 'Emergency session resolved by Super Admin', sos });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to resolve emergency session' });
  }
};
