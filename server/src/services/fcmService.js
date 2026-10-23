import admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';
import path from 'path';
import fs from 'fs';

let firebaseInitialized = false;

/**
 * Initialize Firebase Admin SDK
 * Looks for serviceAccountKey.json or env credentials
 */
export function initFirebase() {
  if (firebaseInitialized) return admin;

  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
      path.resolve(process.cwd(), 'serviceAccountKey.json');

    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.cert(serviceAccount),
      });
      firebaseInitialized = true;
      console.log('✅ [FCM] Firebase Admin SDK initialized with service account key');
    } else if (process.env.FIREBASE_CONFIG) {
      const config = JSON.parse(process.env.FIREBASE_CONFIG);
      admin.initializeApp({
        credential: admin.cert(config),
      });
      firebaseInitialized = true;
      console.log('✅ [FCM] Firebase Admin SDK initialized with FIREBASE_CONFIG');
    } else {
      console.warn('⚠️ [FCM] No serviceAccountKey.json or FIREBASE_CONFIG found. Emergency push will be simulated/logged.');
    }
  } catch (error) {
    console.warn('⚠️ [FCM] Initialization warning:', error.message);
  }

  return admin;
}

/**
 * Send High-Priority Emergency Siren Push Notification
 * Wakes device from sleep and plays emergency siren on channel: 'emergency_sos_siren_channel'
 * 
 * @param {Object} params
 * @param {string[]} params.tokens - FCM device tokens of parents & admins
 * @param {string} params.victimName - Name of person who triggered SOS
 * @param {string|number} params.sosId - SOS Session ID
 * @param {string} params.trackingUrl - Live location tracking URL
 * @param {number} [params.latitude] - Victim latitude
 * @param {number} [params.longitude] - Victim longitude
 */
export async function sendEmergencySirenPush({ tokens, victimName, sosId, trackingUrl, latitude, longitude }) {
  const validTokens = (tokens || []).filter((t) => typeof t === 'string' && t.trim().length > 10);

  if (validTokens.length === 0) {
    return { success: false, reason: 'No valid device tokens provided' };
  }

  console.log(`[FCM] Target tokens count: ${validTokens.length}. Sample: ${validTokens[0].substring(0, 20)}...`);

  // Ensure Firebase is initialized
  initFirebase();

  if (!firebaseInitialized) {
    console.log(`[FCM Mock] Would send emergency siren to ${tokens.length} devices for victim: ${victimName}`);
    return { success: false, reason: 'Firebase not configured' };
  }

  // High-Priority Android Alarm Payload
  const message = {
    tokens: validTokens,
    notification: {
      title: '🚨 EMERGENCY SOS ALERT!',
      body: `${victimName} activated SOS! Tap to open live tracker.`,
    },
    data: {
      type: 'SOS_TRIGGERED',
      sosId: String(sosId),
      victimName: String(victimName),
      trackingUrl: String(trackingUrl || ''),
      latitude: String(latitude || ''),
      longitude: String(longitude || ''),
      timestamp: new Date().toISOString(),
    },
    android: {
      priority: 'high', // Wakes the device from Doze mode immediately
      notification: {
        channelId: 'emergency_sos_siren_channel', // Matches mobile notificationService.js
        sound: 'alarm_siren.wav',                  // Matches res/raw/alarm_siren.wav & expo-notifications
        priority: 'max',
        visibility: 'public',
        defaultVibrateTimings: false,
        vibrateTimingsMillis: [0, 500, 200, 500, 200, 500],
      },
    },
    apns: {
      headers: {
        'apns-priority': '10',
      },
      payload: {
        aps: {
          alert: {
            title: '🚨 EMERGENCY SOS ALERT!',
            body: `${victimName} activated SOS!`,
          },
          sound: 'alarm_siren.wav',
          badge: 1,
          'interruption-level': 'critical',
        },
      },
    },
  };

  try {
    const messaging = getMessaging();
    const response = await messaging.sendEachForMulticast(message);
    console.log(`✅ [FCM] Emergency Siren dispatched: ${response.successCount} success, ${response.failureCount} failed`);

    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`❌ [FCM Error] Token #${idx} failed:`, resp.error?.code, resp.error?.message);
        }
      });
    }

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error('❌ [FCM] Emergency Siren push failed:', error.message);
    return { success: false, error: error.message };
  }
}
