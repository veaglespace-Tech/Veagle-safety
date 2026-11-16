import crypto from 'crypto';
import Razorpay from 'razorpay';
import { config } from '../config/index.js';

/**
 * Razorpay instance — initialized once
 */
export const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

/**
 * Verify Razorpay payment signature after successful payment
 * Formula: HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)
 */
export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}
