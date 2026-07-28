import { prisma } from '../config/prisma.js';
import { sendSosEmergencyAlert } from '../services/mailer.js';
import { getIO } from '../socket.js';

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

    const trackingUrl = `http://localhost:3000/live-track/${session.shareToken}`;

    // Send emails to trusted contacts
    for (const contact of contacts) {
      if (contact.email) {
        sendSosEmergencyAlert({
          recipientEmail: contact.email,
          recipientName: contact.name,
          userName: req.user?.fullName || 'User',
          trackingUrl,
          latitude: initialLat || 18.5204,
          longitude: initialLng || 73.8567,
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

    // Broadcast Real-Time Emergency Siren Alarm to All Devices & Connected Contacts
    const io = getIO();
    if (io) {
      io.emit('SOS_ALARM_BROADCAST', {
        sosId: session.id,
        victimName: req.user?.fullName || 'Sakhi Suraksha User',
        victimPhone: req.user?.phone || '',
        shareToken: session.shareToken,
        trackingUrl,
        latitude: initialLat || 18.5204,
        longitude: initialLng || 73.8567,
        isSilent: session.isSilent,
        contacts: contacts.map((c) => ({ name: c.name, phone: c.phone, email: c.email })),
        timestamp: new Date().toISOString(),
      });
    }

    return res.json({
      message: 'SOS Activated! Emergency alerts & Siren Alarm broadcasted.',
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
    const { sosSessionId, resolutionNote } = req.body;
    const userId = req.user?.id;

    const session = await prisma.sosSession.update({
      where: { id: sosSessionId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolutionNote: resolutionNote || 'Resolved by user',
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { safetyStatus: 'SAFE' },
    });

    // Broadcast Alarm Stop Event
    const io = getIO();
    if (io) {
      io.emit('SOS_ALARM_STOP', { sosId: sosSessionId });
    }

    return res.json({ message: 'SOS session resolved safely.', session });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to resolve SOS session' });
  }
};

export const getActiveSosSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    const session = await prisma.sosSession.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { locations: { orderBy: { recordedAt: 'desc' }, take: 1 } },
    });

    return res.json({ session });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch active SOS session' });
  }
};

export const getPublicSosTracking = async (req, res) => {
  try {
    const { token } = req.params;

    const session = await prisma.sosSession.findUnique({
      where: { shareToken: token },
      include: {
        user: { select: { fullName: true, phone: true, profilePhoto: true, bloodGroup: true } },
        locations: { orderBy: { recordedAt: 'desc' }, take: 20 },
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Tracking session not found or expired' });
    }

    return res.json({ session });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tracking data' });
  }
};
