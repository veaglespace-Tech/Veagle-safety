import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import { config } from '../config/index.js';

const FALLBACK_KEY_ID = 'rzp_test_TzzM4GlVTuysWB';
const FALLBACK_KEY_SECRET = '7D4eWuimEdPtjUoIkj4Q8AeW';

const cleanValue = (val) => {
  if (!val) return '';
  let str = String(val).trim();
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    str = str.slice(1, -1).trim();
  }
  return str;
};

/**
 * Dynamically resolves Razorpay credentials at runtime.
 * Checks:
 * 1. Disk .env files (to pick up live edits without requiring server restart)
 * 2. process.env with all known alias keys
 * 3. config.razorpay
 * 4. Verified fallback credentials
 */
export function resolveRazorpayCredentials() {
  const diskEnv = {};

  try {
    const serverDir = fileURLToPath(new URL('../..', import.meta.url));
    const repoDir = path.dirname(serverDir);
    const candidateFiles = [
      path.join(serverDir, '.env'),
      path.join(repoDir, '.env'),
      path.join(process.cwd(), '.env'),
      '/root/Veagle-safety/server/.env',
      '/root/Veagle-safety/.env',
    ];

    for (const filePath of [...new Set(candidateFiles)]) {
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const parsed = dotenv.parse(content);
          for (const [k, v] of Object.entries(parsed)) {
            if (v && String(v).trim()) {
              diskEnv[k.trim()] = String(v).trim();
            }
          }
        } catch (_) {}
      }
    }
  } catch (_) {}

  const findValue = (...keys) => {
    for (const k of keys) {
      if (diskEnv[k]) return cleanValue(diskEnv[k]);
      if (process.env[k]) return cleanValue(process.env[k]);
    }
    return '';
  };

  const keyId =
    findValue(
      'RAZORPAY_KEY_ID',
      'RAZORPAY_API_KEY',
      'RAZORPAY_KEY',
      'NEXT_PUBLIC_RAZORPAY_KEY_ID',
      'NEXT_PUBLIC_RAZORPAY_KEY'
    ) ||
    cleanValue(config.razorpay?.keyId) ||
    FALLBACK_KEY_ID;

  const keySecret =
    findValue(
      'RAZORPAY_KEY_SECRET',
      'RAZORPAY_API_SECRET',
      'RAZORPAY_SECRET',
      'RAZORPAY_SECRET_KEY'
    ) ||
    cleanValue(config.razorpay?.keySecret) ||
    FALLBACK_KEY_SECRET;

  return { keyId, keySecret };
}

/**
 * Razorpay instance — dynamically instantiated so credentials can be reloaded at runtime
 */
let cachedClient = null;
let cachedKeyId = null;
let cachedKeySecret = null;

export function getRazorpayClient() {
  const { keyId, keySecret } = resolveRazorpayCredentials();

  if (!cachedClient || cachedKeyId !== keyId || cachedKeySecret !== keySecret) {
    cachedClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
    cachedKeyId = keyId;
    cachedKeySecret = keySecret;
  }

  return cachedClient;
}

/**
 * Verify Razorpay payment signature after successful payment
 * Formula: HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)
 */
export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const { keySecret } = resolveRazorpayCredentials();
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}
