import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import { config } from '../config/index.js';

const cleanValue = (val) => {
  if (val === undefined || val === null) return '';
  let str = String(val).trim();
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    str = str.slice(1, -1).trim();
  }
  return str;
};

const cleanKey = (k) => {
  if (!k) return '';
  return String(k).replace(/^\uFEFF/, '').trim().toUpperCase();
};

/**
 * Dynamically resolves Razorpay credentials strictly from environment variables or .env files.
 * Features:
 * - UTF-8 BOM stripping
 * - Case-insensitive key matching
 * - Quote stripping
 * - Multi-path lookup (server/.env, repo/.env, cwd/.env, VPS paths)
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
            const normalizedKey = cleanKey(k);
            const normalizedVal = cleanValue(v);
            if (normalizedKey && normalizedVal) {
              diskEnv[normalizedKey] = normalizedVal;
            }
          }
        } catch (_) {}
      }
    }
  } catch (_) {}

  // Collect from process.env as well
  const envMap = { ...diskEnv };
  for (const [k, v] of Object.entries(process.env)) {
    const normalizedKey = cleanKey(k);
    const normalizedVal = cleanValue(v);
    if (normalizedKey && normalizedVal && !envMap[normalizedKey]) {
      envMap[normalizedKey] = normalizedVal;
    }
  }

  // Find keyId
  let keyId =
    envMap['RAZORPAY_KEY_ID'] ||
    envMap['RAZORPAY_API_KEY'] ||
    envMap['RAZORPAY_KEY'] ||
    envMap['NEXT_PUBLIC_RAZORPAY_KEY_ID'] ||
    envMap['NEXT_PUBLIC_RAZORPAY_KEY'] ||
    cleanValue(config.razorpay?.keyId);

  if (!keyId) {
    // Flexible search: any key containing RAZORPAY and (KEY or ID) but NOT SECRET
    for (const [k, v] of Object.entries(envMap)) {
      if (k.includes('RAZORPAY') && (k.includes('KEY') || k.includes('ID')) && !k.includes('SECRET')) {
        keyId = v;
        break;
      }
    }
  }

  // Find keySecret
  let keySecret =
    envMap['RAZORPAY_KEY_SECRET'] ||
    envMap['RAZORPAY_API_SECRET'] ||
    envMap['RAZORPAY_SECRET'] ||
    envMap['RAZORPAY_SECRET_KEY'] ||
    cleanValue(config.razorpay?.keySecret);

  if (!keySecret) {
    // Flexible search: any key containing RAZORPAY and SECRET
    for (const [k, v] of Object.entries(envMap)) {
      if (k.includes('RAZORPAY') && k.includes('SECRET')) {
        keySecret = v;
        break;
      }
    }
  }

  return { keyId: keyId || '', keySecret: keySecret || '' };
}

/**
 * Razorpay instance — dynamically instantiated so credentials can be reloaded at runtime
 */
let cachedClient = null;
let cachedKeyId = null;
let cachedKeySecret = null;

export function getRazorpayClient() {
  const { keyId, keySecret } = resolveRazorpayCredentials();

  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured in environment variables (.env).');
  }

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
  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET must be configured in environment variables (.env).');
  }

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}
