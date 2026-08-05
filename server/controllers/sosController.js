import { prisma } from '../config/prisma.js';
import { config } from '../config/index.js';
import { sendSosEmergencyAlert, sendSosSafeAlert } from '../services/mailer.js';
import { getIO } from '../socket.js';
import { sendEmergencyPushToEmails } from './pushController.js';

export const startSos = async (req, res) => {
  try {
    const { isSilent, initialLat, initialLng } = req.body;
    const userId = req.user?.id;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        profilePhoto: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        parentEmail: true,
      },
    });

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

    const latitude = initialLat || 18.5204;
    const longitude = initialLng || 73.8567;

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

    const clientBaseUrl = process.env.CLIENT_URL || config.payu?.clientUrl || 'http://localhost:3000';
    const trackingUrl = `${clientBaseUrl}/live-track/${session.shareToken}`;
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const adminEmail = process.env.ADMIN_EMAIL || 'abhijeetambhore4@gmail.com';

    // 1. Collect Recipient Emails (User + Admin + Parent Emergency Email + Guardian Contacts)
    const recipientEmails = new Set();
    if (currentUser?.email) recipientEmails.add(currentUser.email);
    if (adminEmail) recipientEmails.add(adminEmail);
    if (currentUser?.parentEmail) recipientEmails.add(currentUser.parentEmail);

    contacts.forEach((c) => {
      if (c.email) recipientEmails.add(c.email);
    });

    // 2. Dispatch High-Priority Emergency Emails
    for (const email of recipientEmails) {
      sendSosEmergencyAlert({
        recipientEmail: email,
        recipientName: 'Safety Guardian',
        userName: currentUser?.fullName || 'Sakhi User',
        userPhone: currentUser?.phone || 'N/A',
        userEmail: currentUser?.email || 'N/A',
        userPhoto: currentUser?.profilePhoto || null,
        trackingUrl,
        googleMapsUrl,
        latitude,
        longitude,
        sosId: session.id,
      });

      await prisma.sosAlert.create({
        data: {
          sosSessionId: session.id,
          channel: 'EMAIL',
          recipient: email,
          status: 'SENT',
        },
      }).catch(() => {});
    }

    // 3. Format Direct WhatsApp Emergency Alert Links for Guardians
    const baseMessageText = `🚨 SAKHI EMERGENCY SOS ALERT!\n\nVictim: ${currentUser?.fullName || 'Sakhi Member'}\nPhone: ${currentUser?.phone || ''}\n\n📍 GPS Coordinates:\nLat: ${latitude}, Lng: ${longitude}\n\n👉 Live Location Map:\n${trackingUrl}\n\n🌐 Google Maps:\n${googleMapsUrl}`;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(baseMessageText)}`;

    const whatsappAlerts = contacts.map((contact) => {
      const cleanPhone = (contact.phone || '').replace(/\D/g, '');
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(baseMessageText)}`;

      return {
        contactName: contact.name,
        phone: contact.phone,
        whatsappUrl,
      };
    });

    // 4. Broadcast Real-Time Emergency Siren Alarm to Connected Sockets
    const io = getIO();
    if (io) {
      io.emit('SOS_ALARM_BROADCAST', {
        sosId: session.id,
        victimName: currentUser?.fullName || 'Sakhi Suraksha User',
        victimPhone: currentUser?.phone || '',
        victimPhoto: currentUser?.profilePhoto || null,
        shareToken: session.shareToken,
        trackingUrl,
        googleMapsUrl,
        latitude,
        longitude,
        isSilent: session.isSilent,
        contacts: contacts.map((c) => ({ name: c.name, phone: c.phone, email: c.email })),
        whatsappAlerts,
        whatsappShareUrl,
        timestamp: new Date().toISOString(),
      });
    }

    // 5. Send Web Push Notifications to all trusted contacts' devices
    const contactEmailsList = Array.from(recipientEmails);
    await sendEmergencyPushToEmails({
      emails: contactEmailsList,
      victimName: currentUser?.fullName || 'Sakhi Suraksha User',
      trackingUrl,
      latitude,
      longitude,
    });

    return res.json({
      message: 'SOS Activated! Emergency Emails, WhatsApp Alerts & Siren Broadcasted.',
      sosSession: {
        id: session.id,
        shareToken: session.shareToken,
        startedAt: session.startedAt,
        isSilent: session.isSilent,
        trackingUrl,
        googleMapsUrl,
        whatsappAlerts,
        whatsappShareUrl,
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

    // Emit live location update to connected sockets
    const io = getIO();
    if (io) {
      io.emit('SOS_LOCATION_UPDATE', {
        sosSessionId,
        latitude,
        longitude,
        accuracy: accuracy || 10,
        recordedAt: location.recordedAt,
      });
    }

    return res.json({ message: 'Location updated', location });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to record location update' });
  }
};

export const resolveSos = async (req, res) => {
  try {
    const { sosSessionId, resolutionNote } = req.body;
    const userId = req.user?.id;

    let targetId = sosSessionId ? parseInt(sosSessionId, 10) : null;
    if ((!targetId || isNaN(targetId)) && userId) {
      const activeSession = await prisma.sosSession.findFirst({
        where: { userId, status: 'ACTIVE' },
      });
      if (activeSession) {
        targetId = activeSession.id;
      }
    }

    if (!targetId || isNaN(targetId)) {
      return res.status(404).json({ error: 'No active SOS session found to resolve' });
    }

    const session = await prisma.sosSession.update({
      where: { id: targetId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolutionNote: resolutionNote || 'Resolved by user',
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            profilePhoto: true,
            emergencyContactName: true,
            emergencyContactPhone: true,
            parentEmail: true,
            trustedContacts: true,
          },
        },
        locations: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
    });

    const targetUserId = userId || session.userId;
    if (targetUserId) {
      await prisma.user.update({
        where: { id: targetUserId },
        data: { safetyStatus: 'SAFE' },
      }).catch(() => {});
    }

    const latestLocation = session.locations?.[0];
    const latitude = latestLocation?.latitude || session.latitude || 18.5204;
    const longitude = latestLocation?.longitude || session.longitude || 73.8567;
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const adminEmail = process.env.ADMIN_EMAIL || 'abhijeetambhore4@gmail.com';

    // 1. Collect Recipient Emails for Safe Confirmation (User + Admin + Parent + Guardians)
    const recipientEmails = new Set();
    if (session.user?.email) recipientEmails.add(session.user.email);
    if (adminEmail) recipientEmails.add(adminEmail);
    if (session.user?.parentEmail) recipientEmails.add(session.user.parentEmail);

    if (session.user?.trustedContacts && Array.isArray(session.user.trustedContacts)) {
      session.user.trustedContacts.forEach((c) => {
        if (c.email) recipientEmails.add(c.email);
      });
    }

    // 2. Dispatch "I AM SAFE NOW" Confirmation Emails
    for (const email of recipientEmails) {
      try {
        await sendSosSafeAlert({
          recipientEmail: email,
          userName: session.user?.fullName || 'Sakhi Member',
          userPhone: session.user?.phone || 'N/A',
          userPhoto: session.user?.profilePhoto || null,
          googleMapsUrl,
          latitude,
          longitude,
          resolvedAt: session.resolvedAt,
        });

        await prisma.sosAlert.create({
          data: {
            sosSessionId: session.id,
            channel: 'EMAIL_SAFE_CONFIRMATION',
            recipient: email,
            status: 'SENT',
          },
        }).catch(() => {});
      } catch (emailErr) {
        console.error(`[Safe Email Error] Failed to send safe email to ${email}:`, emailErr.message);
      }
    }

    // 3. Format WhatsApp Safe Confirmation Message Links
    const whatsappSafeAlerts = (session.user?.trustedContacts || []).map((contact) => {
      const cleanPhone = (contact.phone || '').replace(/\D/g, '');
      const safeMessage = `✅ SAKHI MEMBER IS SAFE NOW!\n\nVictim: ${session.user?.fullName || 'Sakhi Member'}\nStatus: RESOLVED & SAFE\nTime: ${new Date(session.resolvedAt).toLocaleString('en-IN')}\n\n📍 Final Location:\nLat: ${latitude}, Lng: ${longitude}\n🌐 Google Maps:\n${googleMapsUrl}`;
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(safeMessage)}`;

      return {
        contactName: contact.name,
        phone: contact.phone,
        whatsappUrl,
      };
    });

    // 4. Broadcast Alarm Stop Event
    const io = getIO();
    if (io) {
      io.emit('SOS_ALARM_STOP', {
        sosId: sosSessionId,
        victimName: session.user?.fullName || 'Sakhi Member',
        whatsappSafeAlerts,
      });
    }

    return res.json({
      message: 'SOS session resolved safely. Safe emails & WhatsApp alerts dispatched.',
      session,
      whatsappSafeAlerts,
    });
  } catch (error) {
    console.error('Resolve SOS Error:', error);
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
