import { prisma } from '../config/prisma.js';
import { config } from '../config/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { generatePayUHash, verifyPayUResponseHash } from '../utils/payu.js';

/**
 * Initiate PayU Payment for User Subscription
 */
export const initiatePayUPayment = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { planId } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Fetch target plan or fetch/create default 24 INR plan
  let plan = null;
  if (planId) {
    plan = await prisma.plan.findUnique({ where: { id: planId } });
  }

  if (!plan) {
    plan = await prisma.plan.findFirst({ where: { isActive: true } });
  }

  // Get dynamic GST percentage from SystemSetting if available
  let gstPercentage = plan ? plan.gstPercentage : 18.0;
  const gstSetting = await prisma.systemSetting.findUnique({ where: { key: 'GST_PERCENTAGE' } });
  if (gstSetting) {
    gstPercentage = parseFloat(gstSetting.value) || 18.0;
  }

  const baseAmount = plan ? plan.basePrice : 24.0;
  const gstAmount = parseFloat(((baseAmount * gstPercentage) / 100).toFixed(2));
  const totalAmount = parseFloat((baseAmount + gstAmount).toFixed(2));

  const txnid = `VEAGLE_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
  const productinfo = plan ? plan.name : 'Veagle Safety Monthly Subscription';
  const firstname = user.fullName.split(' ')[0] || user.fullName;
  const email = user.email;

  const hash = generatePayUHash({
    txnid,
    amount: totalAmount,
    productinfo,
    firstname,
    email,
  });

  // Save pending transaction record
  await prisma.paymentHistory.create({
    data: {
      userId: user.id,
      planId: plan ? plan.id : null,
      txnid,
      amount: totalAmount,
      baseAmount,
      gstAmount,
      gstPercentage,
      status: 'PENDING',
      hash,
    },
  });

  const surl = `${config.payu.serverBaseUrl}/api/payment/payu-success`;
  const furl = `${config.payu.serverBaseUrl}/api/payment/payu-failure`;

  return res.json({
    message: 'Payment transaction initiated',
    paymentData: {
      actionUrl: config.payu.baseUrl,
      key: config.payu.key,
      txnid,
      amount: totalAmount,
      baseAmount,
      gstAmount,
      gstPercentage,
      productinfo,
      firstname,
      email,
      phone: user.phone,
      surl,
      furl,
      hash,
    },
  });
});

/**
 * PayU Success Callback Handler
 */
export const handlePayUSuccess = asyncHandler(async (req, res) => {
  const payuResponse = req.body;
  const { txnid, mihpayid, mode, status } = payuResponse;

  const verification = verifyPayUResponseHash(payuResponse);

  const paymentRecord = await prisma.paymentHistory.findUnique({ where: { txnid } });
  if (!paymentRecord) {
    return res.status(404).json({ error: 'Transaction record not found' });
  }

  if (status === 'success' || verification.isValid) {
    // Update Payment status
    await prisma.paymentHistory.update({
      where: { id: paymentRecord.id },
      data: {
        status: 'SUCCESS',
        payuMoneyId: mihpayid || payuResponse.payuMoneyId || null,
        paymentMode: mode || payuResponse.mode || 'ONLINE',
      },
    });

    // Calculate subscription expiry (30 days from now)
    const durationDays = 30;
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    // Update user subscription
    await prisma.user.update({
      where: { id: paymentRecord.userId },
      data: {
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: expiresAt,
        currentPlanId: paymentRecord.planId,
      },
    });

    // If request comes from client web browser form submission, redirect to client app
    const clientRedirectUrl = `${config.payu.clientUrl}/payment-status?status=success&txnid=${txnid}`;
    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      return res.redirect(clientRedirectUrl);
    }

    return res.json({
      success: true,
      message: 'Payment completed and subscription activated successfully',
      txnid,
      status: 'SUCCESS',
    });
  } else {
    await prisma.paymentHistory.update({
      where: { id: paymentRecord.id },
      data: { status: 'FAILED' },
    });

    const clientRedirectUrl = `${config.payu.clientUrl}/payment-status?status=failed&txnid=${txnid}`;
    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      return res.redirect(clientRedirectUrl);
    }

    return res.status(400).json({
      success: false,
      message: 'Payment hash verification failed or transaction declined',
    });
  }
});

/**
 * PayU Failure Callback Handler
 */
export const handlePayUFailure = asyncHandler(async (req, res) => {
  const { txnid } = req.body;

  if (txnid) {
    await prisma.paymentHistory.updateMany({
      where: { txnid },
      data: { status: 'FAILED' },
    });
  }

  const clientRedirectUrl = `${config.payu.clientUrl}/payment-status?status=failed&txnid=${txnid || ''}`;
  if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
    return res.redirect(clientRedirectUrl);
  }

  return res.status(400).json({
    success: false,
    message: 'Payment failed or cancelled by user',
  });
});

/**
 * Get User Payment History
 */
export const getUserPaymentHistory = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  const history = await prisma.paymentHistory.findMany({
    where: { userId },
    include: { plan: true },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ history });
});
