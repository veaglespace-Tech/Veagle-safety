import crypto from 'crypto';
import Razorpay from 'razorpay';
import { config } from '../config/index.js';

const key_id = config.razorpay.keyId;
const key_secret = config.razorpay.keySecret;

/**
 * Razorpay instance — initialized from environment-provided credentials
 */
let razorpay;

export function getRazorpayClient() {
  if (!key_id || !key_secret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured in environment variables.');
  }

  razorpay ??= new Razorpay({ key_id, key_secret });
  return razorpay;
}

/**
 * Verify Razorpay payment signature after successful payment
 * Formula: HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)
 */
export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  if (!key_secret) {
    throw new Error('RAZORPAY_KEY_SECRET must be configured in environment variables.');
  }

  const secret = key_secret;
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}
