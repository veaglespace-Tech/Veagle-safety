import crypto from 'crypto';
import Razorpay from 'razorpay';
import { config } from '../config/index.js';

const key_id = config.razorpay.keyId;
const key_secret = config.razorpay.keySecret;

if (!key_id || !key_secret) {
  throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured in environment variables.');
}

/**
 * Razorpay instance — initialized from environment-provided credentials
 */
export const razorpay = new Razorpay({
  key_id,
  key_secret,
});

/**
 * Verify Razorpay payment signature after successful payment
 * Formula: HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)
 */
export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const secret = key_secret;
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}
