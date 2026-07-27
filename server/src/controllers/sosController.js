import { prisma } from '../config/prisma.js';
import { sendSosEmergencyAlert } from '../services/mailer.js';

export const startSos = async (req, res) => {
  try {
    const { isSilent, initialLat, initialLng } = req.body;
    const userId = req.user?.id;

    let session = await prisma.sosSession.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!session) {
      session = await prisma.sosSession.create({
        data: {
          userId,
          isSilent: !!isSilent,
        },
      });
    }

    if (initialLat && initialLng) {
      await prisma.sosLocation.create({
        data: {
          sosSessionId: session.id,
          latitude: initialLat,
          longitude: initialLng,
          accuracy: 10,
        },
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { safetyStatus: 'SOS_ACTIVE' },
    });

    const contacts = await prisma.trustedContact.findMany({
      where: { userId },
    });

    const trackingUrl = `http://localhost:5173/track/${session.shareToken}`;

    for (const contact of contacts) {
      if (contact.email) {
        sendSosEmergencyAlert({
          recipientEmail: contact.email,
          recipientName: contact.name,
          userName: req.user?.fullName || 'User',
          trackingUrl,
          latitude: initialLat || 28.6139,
          longitude: initialLng || 77.2090,
        });

        await prisma.sosAlert.create({
          data: {
            sosSessionId: session.id,
            channel: 'EMAIL',
            recipient: contact.email,
            status: 'SENT',
          },
        });
      }
    }

    return res.json({
      message: 'SOS Activated! Emergency alerts sent.',
      sosSession: {
        id: session.id,
        shareToken: session.shareToken,
        startedAt: session.startedAt,
        isSilent: session.isSilent,
        trackingUrl,
      },
    });
  } catch (error) {
    console.error('SOS Start Error:', error);
    return res.status(500).json({ error: 'Failed to trigger emergency SOS session' });
  }
};

export const updateSosLocation = async (req, res) => {
  try {
    const { sosSessionId, latitude, longitude, accuracy } = req.body;

    const location = await prisma.sosLocation.create({
      data: {
        sosSessionId,
        latitude,
        longitude,
        accuracy: accuracy || 10,
      },
    });

    return res.json({ message: 'Location updated', location });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to record location update' });
  }
};

export const resolveSos = async (req, res) => {
  try {
    const { sosSessionId } = req.body;

    const session = await prisma.sosSession.update({
      where: { id: sosSessionId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: { safetyStatus: 'SAFE' },
    });

    return res.json({ message: 'Emergency session marked safe', session });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to resolve emergency session' });
  }
};

export const getActiveSosSession = async (req, res) => {
  try {
    const session = await prisma.sosSession.findFirst({
      where: { userId: req.user?.id, status: 'ACTIVE' },
      include: {
        locations: { orderBy: { recordedAt: 'desc' }, take: 1 },
      },
    });

    return res.json({ session });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch active SOS session' });
  }
};

export const getPublicSosTracking = async (req, res) => {
  try {
    const { token } = req.params;

    const sosSession = await prisma.sosSession.findUnique({
      where: { shareToken: token },
      include: {
        user: { select: { fullName: true, phone: true } },
        locations: { orderBy: { recordedAt: 'desc' }, take: 20 },
      },
    });

    if (!sosSession) {
      return res.status(404).json({ error: 'Tracking session expired or invalid' });
    }

    return res.json({ sosSession });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load public tracking view' });
  }
};
