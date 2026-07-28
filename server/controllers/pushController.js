import webpush from 'web-push';
import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// Configure VAPID
webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:admin@veaglesafety.org',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/**
 * Save push subscription for current user (by email)
 */
export const savePushSubscription = asyncHandler(async (req, res) => {
  const { subscription } = req.body;
  const userEmail = req.user?.email;

  if (!subscription || !userEmail) {
    return res.status(400).json({ error: 'Subscription and user email required' });
  }

  const { endpoint, keys } = subscription;
  const { p256dh, auth } = keys;

  // Upsert so each device only saves once
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { p256dh, auth, userEmail, updatedAt: new Date() },
    create: { userEmail, endpoint, p256dh, auth },
  });

  return res.json({ success: true, message: 'Push subscription saved' });
});

/**
 * Save push subscription by email (for trusted contacts visiting site)
 */
export const savePushSubscriptionByEmail = asyncHandler(async (req, res) => {
  const { subscription, email } = req.body;

  if (!subscription || !email) {
    return res.status(400).json({ error: 'Subscription and email required' });
  }

  const { endpoint, keys } = subscription;
  const { p256dh, auth } = keys;

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { p256dh, auth, userEmail: email, updatedAt: new Date() },
    create: { userEmail: email, endpoint, p256dh, auth },
  });

  return res.json({ success: true, message: 'Push subscription saved' });
});

/**
 * Send emergency SOS push notification to specific emails
 * Called from sosController when SOS is triggered
 */
export const sendEmergencyPushToEmails = async ({ emails, victimName, trackingUrl, latitude, longitude }) => {
  if (!emails || emails.length === 0) return;

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userEmail: { in: emails } },
  });

  if (subscriptions.length === 0) {
    console.log('[WebPush] No push subscriptions found for contacts');
    return;
  }

  const payload = JSON.stringify({
    title: '🚨 EMERGENCY SOS ALARM',
    body: `${victimName} has triggered an Emergency SOS Alert! Open immediately.`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      type: 'SOS_EMERGENCY',
      victimName,
      trackingUrl,
      latitude,
      longitude,
      url: trackingUrl,
    },
    actions: [
      { action: 'view-map', title: 'View Live Location' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    )
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;
  console.log(`[WebPush] Emergency push sent: ${sent} success, ${failed} failed`);
};

/**
 * Get VAPID public key (for client subscription)
 */
export const getVapidPublicKey = asyncHandler(async (req, res) => {
  return res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});
