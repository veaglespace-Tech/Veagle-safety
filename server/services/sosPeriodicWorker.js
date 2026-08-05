import { prisma } from '../config/prisma.js';
import { config } from '../config/index.js';
import { sendSos5MinLocationUpdate } from './mailer.js';
import { getIO } from '../socket.js';

let intervalTimer = null;

/**
 * Start the 5-Minute Recurring Periodic GPS Location Worker
 */
export const startSosPeriodicWorker = () => {
  if (intervalTimer) return;

  console.log('⏰ [SOS Periodic Worker] Initializing 5-Minute Recurring GPS Alert Worker...');

  // Run every 5 minutes (300,000 ms)
  const PERIODIC_INTERVAL_MS = 5 * 60 * 1000;

  intervalTimer = setInterval(async () => {
    try {
      // 1. Fetch all currently ACTIVE SOS Sessions
      const activeSessions = await prisma.sosSession.findMany({
        where: { status: 'ACTIVE' },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              profilePhoto: true,
              emergencyContactName: true,
              trustedContacts: true,
            },
          },
          locations: {
            orderBy: { recordedAt: 'desc' },
            take: 1,
          },
        },
      });

      if (activeSessions.length === 0) {
        return;
      }

      console.log(`📡 [SOS Periodic Worker] Dispatching 5-minute location updates for ${activeSessions.length} active emergency sessions...`);

      const clientBaseUrl = process.env.CLIENT_URL || config.payu?.clientUrl || 'http://localhost:3000';
      const adminEmail = process.env.ADMIN_EMAIL || 'abhijeetambhore4@gmail.com';

      for (const session of activeSessions) {
        const victim = session.user;
        const latestLocation = session.locations?.[0];

        const latitude = latestLocation?.latitude || session.latitude || 18.5204;
        const longitude = latestLocation?.longitude || session.longitude || 73.8567;
        const trackingUrl = `${clientBaseUrl}/live-track/${session.shareToken}`;
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        // Collect all target recipient emails (Victim + Admin + Guardians)
        const recipientEmails = new Set();
        if (victim?.email) recipientEmails.add(victim.email);
        if (adminEmail) recipientEmails.add(adminEmail);
        if (victim?.emergencyContactEmail) recipientEmails.add(victim.emergencyContactEmail);

        if (victim?.trustedContacts && Array.isArray(victim.trustedContacts)) {
          victim.trustedContacts.forEach((contact) => {
            if (contact.email) recipientEmails.add(contact.email);
          });
        }

        // Send 5-minute periodic email alert to each recipient
        for (const recipientEmail of recipientEmails) {
          sendSos5MinLocationUpdate({
            recipientEmail,
            victimName: victim?.fullName || 'Sakhi Member',
            victimPhone: victim?.phone || 'N/A',
            victimEmail: victim?.email || 'N/A',
            victimPhoto: victim?.profilePhoto || null,
            trackingUrl,
            googleMapsUrl,
            latitude,
            longitude,
            sosId: session.id,
            startedAt: session.startedAt,
          });

          // Log in SosAlert ledger table
          await prisma.sosAlert.create({
            data: {
              sosSessionId: session.id,
              channel: 'EMAIL_5MIN_PERIODIC',
              recipient: recipientEmail,
              status: 'SENT',
            },
          }).catch(() => {});
        }

        // Emit Socket.io periodic update event
        const io = getIO();
        if (io) {
          io.emit('SOS_PERIODIC_5MIN_UPDATE', {
            sosId: session.id,
            victimName: victim?.fullName || 'Sakhi Member',
            victimPhone: victim?.phone || 'N/A',
            latitude,
            longitude,
            trackingUrl,
            googleMapsUrl,
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error('❌ [SOS Periodic Worker Error]:', err.message);
    }
  }, PERIODIC_INTERVAL_MS);
};

export const stopSosPeriodicWorker = () => {
  if (intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
    console.log('🛑 [SOS Periodic Worker] Stopped 5-Minute Worker');
  }
};
