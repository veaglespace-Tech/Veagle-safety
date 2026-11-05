import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

let webpush = null;
let vapidConfigured = false;

// Lazy-load web-push and configure VAPID only when keys are available
async function getWebPush() {
  if (webpush) return webpush;
  try {
    const { default: wp } = await import('web-push');
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      wp.setVapidDetails(
        process.env.VAPID_EMAIL || 'mailto:admin@veaglesafety.org',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
      vapidConfigured = true;
      webpush = wp;
    } else {
      console.warn('[WebPush] VAPID keys not configured - push notifications disabled');
    }
  } catch (e) {
    console.warn('[WebPush] web-push module error:', e.message);
  }
  return webpush;
}

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

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh, auth, userEmail, updatedAt: new Date() },
      create: { userEmail, endpoint, p256dh, auth },
    });
  } catch (e) {
    console.error('[WebPush] Failed to save subscription:', e.message);
    return res.status(500).json({ error: 'Failed to save push subscription' });
  }

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

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh, auth, userEmail: email, updatedAt: new Date() },
      create: { userEmail: email, endpoint, p256dh, auth },
    });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to save push subscription' });
  }

  return res.json({ success: true, message: 'Push subscription saved' });
});

/**
 * Send emergency SOS push notification to specific emails
 * Called from sosController when SOS is triggered
 */
export const sendEmergencyPushToEmails = async ({ emails, victimName, trackingUrl, latitude, longitude }) => {
  if (!emails || emails.length === 0) return;

  const wp = await getWebPush();
  if (!wp || !vapidConfigured) {
    console.log('[WebPush] Skipping push - VAPID not configured');
    return;
  }

  let subscriptions = [];
  try {
    subscriptions = await prisma.pushSubscription.findMany({
      where: { userEmail: { in: emails } },
    });
  } catch (e) {
    console.warn('[WebPush] DB query failed:', e.message);
    return;
  }

  if (subscriptions.length === 0) {
    console.log('[WebPush] No push subscriptions found for contacts:', emails);
    return;
  }

  const payload = JSON.stringify({
    title: '🚨 EMERGENCY SOS ALARM',
    body: `${victimName} has triggered an Emergency SOS! Open immediately.`,
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
      { action: 'view-map', title: '📍 View Live Location' },
    ],
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      wp.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    )
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;
  console.log(`[WebPush] Emergency push: ${sent} sent, ${failed} failed`);
};

/**
 * Register mobile FCM device token for logged-in user
 * 
 * Rules:
 * 1. ONLY Guardians/Parents, Admins, Organizations, or users with active wards/dependents should store tokens.
 *    Regular child/ward users who do not protect anyone do not receive siren push alerts, so their tokens are ignored.
 * 2. Prevent device token duplicacy when switching devices:
 *    When a user registers on a new device with the same token type (or new device session),
 *    old tokens belonging to this user are replaced so one active device token per platform/type is kept.
 */
export const registerDeviceToken = asyncHandler(async (req, res) => {
  const { token, platform = 'android' } = req.body;
  const userId = req.user?.id;

  if (!token || !userId) {
    return res.status(400).json({ error: 'Device token and authenticated user required' });
  }

  try {
    // 1. Fetch user to check role and guardian status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        parentLinks: {
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only allow token creation for:
    // - SUPER_ADMIN
    // - ORGANIZATION
    // - PARENT
    // - Any user who is a guardian (has at least 1 ward/child linked in parentLinks)
    const isGuardianOrAdmin =
      user.role === 'SUPER_ADMIN' ||
      user.role === 'ORGANIZATION' ||
      user.role === 'PARENT' ||
      (user.parentLinks && user.parentLinks.length > 0);

    if (!isGuardianOrAdmin) {
      return res.status(200).json({
        success: true,
        skipped: true,
        message: 'Device token registration not required for member/child accounts (only guardians/admins receive siren alerts).',
      });
    }

    // 2. Prevent token duplicacy across devices:
    // If this token was previously assigned to someone else on this device, remove it
    await prisma.deviceToken.deleteMany({
      where: { token },
    });

    // Check token format (Expo token vs Native FCM token)
    const isExpo = token.startsWith('ExponentPushToken[') || token.startsWith('ExpoPushToken[');

    // If user already has an older token of the same type (Expo vs Native), delete the older one
    // so logging into a new device replaces the old device token cleanly without accumulating stale rows
    const userTokens = await prisma.deviceToken.findMany({
      where: { userId },
    });

    const duplicateTokensToDelete = userTokens
      .filter((t) => {
        const tIsExpo = t.token.startsWith('ExponentPushToken[') || t.token.startsWith('ExpoPushToken[');
        return tIsExpo === isExpo && t.platform === platform && t.token !== token;
      })
      .map((t) => t.id);

    if (duplicateTokensToDelete.length > 0) {
      await prisma.deviceToken.deleteMany({
        where: { id: { in: duplicateTokensToDelete } },
      });
    }

    // 3. Upsert the current device token
    const deviceToken = await prisma.deviceToken.upsert({
      where: { token },
      update: { userId, platform, updatedAt: new Date() },
      create: { userId, token, platform },
    });

    return res.json({ success: true, message: 'Device token registered', data: deviceToken });
  } catch (error) {
    console.error('[DeviceToken] Failed to register token:', error.message);
    return res.status(500).json({ error: 'Failed to register device token' });
  }
});

/**
 * Remove mobile device token on logout
 */
export const removeDeviceToken = asyncHandler(async (req, res) => {
  const { token } = req.body || {};
  const userId = req.user?.id || req.user?.userId;

  if (!token && !userId) {
    return res.status(400).json({ error: 'Device token or authenticated user session required' });
  }

  try {
    const deleteConditions = [];
    if (token) deleteConditions.push({ token });
    if (userId) deleteConditions.push({ userId });

    const result = await prisma.deviceToken.deleteMany({
      where: {
        OR: deleteConditions,
      },
    });
    console.log(`[DeviceToken] Removed ${result.count} device token(s) (token: ${Boolean(token)}, user: ${userId || 'N/A'})`);
    return res.json({ success: true, message: 'Device token removed successfully', count: result.count });
  } catch (error) {
    console.error('[DeviceToken] Failed to remove token:', error.message);
    return res.status(500).json({ error: 'Failed to remove device token' });
  }
});

/**
 * Get VAPID public key (for client subscription)
 */
export const getVapidPublicKey = asyncHandler(async (req, res) => {
  return res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || null });
});
