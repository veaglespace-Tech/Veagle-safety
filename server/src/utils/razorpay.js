import crypto from 'crypto';
import Razorpay from 'razorpay';
import { config } from '../config/index.js';

const key_id = config.razorpay?.keyId || process.env.RAZORPAY_KEY_ID || 'rzp_test_TzzM4GlVTuysWB';
const key_secret = config.razorpay?.keySecret || process.env.RAZORPAY_KEY_SECRET || '7D4eWuimEdPtjUoIkj4Q8AeW';

/**
 * Razorpay instance — initialized safely with fallback
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
  const secret = config.razorpay?.keySecret || process.env.RAZORPAY_KEY_SECRET || key_secret;
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}
