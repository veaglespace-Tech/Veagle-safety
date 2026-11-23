import { prisma } from '../config/prisma.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendPartnerApplicationConfirmation, sendPartnerApplicationApproved } from '../services/mailer.js';
import { config } from '../config/index.js';

// Generate a random 6-character alphanumeric string for referral codes
const generateReferralCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

/**
 * Validates that commission does not exceed plan price (for flat amount) or 100% (for percentage).
 */
const validateCommission = async (discountType, rawValue) => {
  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return { valid: true, value: null };
  }
  const numVal = parseFloat(rawValue);
  if (isNaN(numVal) || numVal <= 0) {
    return { valid: false, message: 'Commission value must be greater than 0.' };
  }
  if (discountType === 'PERCENTAGE' && numVal > 100) {
    return { valid: false, message: 'Commission percentage cannot exceed 100%.' };
  }
  if (discountType === 'FLAT_AMOUNT') {
    const activePlan = await prisma.plan.findFirst({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
    const maxPlanPrice = activePlan ? Number(activePlan.basePrice || activePlan.totalPrice) : 24;
    if (numVal > maxPlanPrice) {
      return {
        valid: false,
        message: `Flat commission (₹${numVal}) cannot exceed the active subscription plan price of ₹${maxPlanPrice}.`,
      };
    }
  }
  return { valid: true, value: numVal };
};

export const createPartner = async (req, res) => {
  try {
    const { name, partnerName, email, mobile, partnerReferralCode, discountPercentage, discountType, discountValue, isActive } = req.body;

    const finalName = name || partnerName;

    if (!finalName || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const finalType = discountType === 'FLAT_AMOUNT' ? 'FLAT_AMOUNT' : 'PERCENTAGE';
    const rawVal = discountValue !== undefined && discountValue !== '' ? discountValue : discountPercentage;

    // Strict validation: Flat amount cannot exceed plan price; percentage cannot exceed 100%
    const validation = await validateCommission(finalType, rawVal);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    // Check if partner already exists
    const existingPartner = await prisma.referralPartner.findUnique({
      where: { email },
    });

    if (existingPartner) {
      return res.status(400).json({ success: false, message: 'Partner with this email already exists.' });
    }

    let finalCode = partnerReferralCode;
    if (!finalCode) {
      // Auto-generate code and ensure it's unique
      let isUnique = false;
      while (!isUnique) {
        finalCode = generateReferralCode();
        const existingCode = await prisma.referralPartner.findUnique({
          where: { partnerReferralCode: finalCode },
        });
        if (!existingCode) {
          isUnique = true;
        }
      }
    } else {
      // Validate provided code uniqueness
      const existingCode = await prisma.referralPartner.findUnique({
        where: { partnerReferralCode: finalCode },
      });
      if (existingCode) {
        return res.status(400).json({ success: false, message: 'Referral code is already taken.' });
      }
    }

    const newPartner = await prisma.referralPartner.create({
      data: {
        name: finalName,
        email,
        mobile,
        partnerReferralCode: finalCode,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    if (validation.value !== null) {
      await prisma.coupon.create({
        data: {
          code: finalCode,
          discountType: finalType,
          discountValue: validation.value,
          isActive: isActive !== undefined ? isActive : true,
        }
      });
    }

    res.status(201).json({ success: true, partner: newPartner });
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ success: false, message: 'Failed to create partner.' });
  }
};

export const getAllPartners = async (req, res) => {
  try {
    const partners = await prisma.referralPartner.findMany({
      include: {
        _count: {
          select: { referredUsers: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const partnerCodes = partners.map(p => p.partnerReferralCode);
    const coupons = await prisma.coupon.findMany({
      where: { code: { in: partnerCodes } }
    });

    const partnersWithDiscount = partners.map(p => {
      const coupon = coupons.find(c => c.code === p.partnerReferralCode);
      return {
        ...p,
        discountType: coupon ? coupon.discountType : 'PERCENTAGE',
        discountPercentage: coupon ? coupon.discountValue : null,
        discountValue: coupon ? coupon.discountValue : null,
      };
    });

    res.status(200).json({ success: true, partners: partnersWithDiscount });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch partners.' });
  }
};

export const getPartnerById = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await prisma.referralPartner.findUnique({
      where: { id: parseInt(id) },
      include: {
        referredUsers: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            subscriptionStatus: true,
            currentPlanId: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' }
        },
      },
    });

    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found.' });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: partner.partnerReferralCode }
    });

    res.status(200).json({ 
      success: true, 
      partner: {
        ...partner,
        discountType: coupon ? coupon.discountType : 'PERCENTAGE',
        discountPercentage: coupon ? coupon.discountValue : null,
        discountValue: coupon ? coupon.discountValue : null,
      }
    });
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch partner.' });
  }
};

export const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { partnerName, name, email, partnerReferralCode, discountPercentage, discountType, discountValue, isActive } = req.body;

    const partnerId = parseInt(id);
    const finalName = partnerName || name;

    const oldPartner = await prisma.referralPartner.findUnique({ where: { id: partnerId } });
    if (!oldPartner) {
      return res.status(404).json({ success: false, message: 'Partner not found.' });
    }

    // Check if updating email or code to an existing one
    if (email || partnerReferralCode) {
      const existing = await prisma.referralPartner.findFirst({
        where: {
          OR: [
            ...(email ? [{ email }] : []),
            ...(partnerReferralCode ? [{ partnerReferralCode }] : []),
          ],
          NOT: { id: partnerId }
        }
      });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email or Referral Code already in use by another partner.' });
      }
    }

    const finalType = discountType === 'FLAT_AMOUNT' ? 'FLAT_AMOUNT' : 'PERCENTAGE';
    const rawVal = discountValue !== undefined && discountValue !== '' ? discountValue : discountPercentage;

    // Strict validation: Flat amount cannot exceed plan price; percentage cannot exceed 100%
    const validation = await validateCommission(finalType, rawVal);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const partner = await prisma.referralPartner.update({
      where: { id: partnerId },
      data: { 
        ...(finalName && { name: finalName }),
        ...(email && { email }),
        ...(partnerReferralCode && { partnerReferralCode }),
        ...(isActive !== undefined && { isActive })
      },
    });

    const oldCode = oldPartner.partnerReferralCode;
    const existingCoupon = await prisma.coupon.findUnique({ where: { code: oldCode } });

    if (existingCoupon) {
      await prisma.coupon.update({
        where: { code: oldCode },
        data: {
          ...(partnerReferralCode && { code: partnerReferralCode }),
          ...(discountType && { discountType: finalType }),
          ...(validation.value !== null && { discountValue: validation.value }),
          ...(isActive !== undefined && { isActive })
        }
      });
    } else if (validation.value !== null) {
      await prisma.coupon.create({
        data: {
          code: partnerReferralCode || oldCode,
          discountType: finalType,
          discountValue: validation.value,
          isActive: isActive !== undefined ? isActive : true,
        }
      });
    }

    res.status(200).json({ success: true, partner });
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ success: false, message: 'Failed to update partner.' });
  }
};

export const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerId = parseInt(id);

    // Check if partner has referred users
    const referredUsersCount = await prisma.user.count({
      where: { referredByPartnerId: partnerId }
    });

    if (referredUsersCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete partner because they have referred users. Please disable them instead.' 
      });
    }

    await prisma.referralPartner.delete({
      where: { id: partnerId }
    });

    res.status(200).json({ success: true, message: 'Partner deleted successfully.' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ success: false, message: 'Failed to delete partner.' });
  }
};

export const getPartnerStats = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and code are required.' });
    }

    const partner = await prisma.referralPartner.findFirst({
      where: {
        email,
        partnerReferralCode: code,
      },
      include: {
        referredUsers: {
          select: {
            subscriptionStatus: true,
          }
        },
      },
    });

    if (!partner) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const totalReferred = partner.referredUsers.length;
    const activeSubscribers = partner.referredUsers.filter(u => u.subscriptionStatus === 'ACTIVE').length;

    res.status(200).json({
      success: true,
      partner: {
        name: partner.name,
        email: partner.email,
        partnerReferralCode: partner.partnerReferralCode,
        isActive: partner.isActive,
      },
      stats: {
        totalReferred,
        activeSubscribers,
      }
    });
  } catch (error) {
    console.error('Error fetching partner stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
};

/**
 * Public Partner Application Submission
 */
export const applyPartner = async (req, res) => {
  try {
    const { name, email, mobile, organizationName, partnerType, message, city } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).json({ success: false, message: 'Full name, email, and mobile number are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = mobile.replace(/\D/g, '');

    // Check if partner already exists
    const existingPartner = await prisma.referralPartner.findUnique({
      where: { email: cleanEmail },
    });

    if (existingPartner) {
      return res.status(400).json({
        success: false,
        message: 'A referral partner account with this email address already exists.',
      });
    }

    // Check if pending application already exists in ContactEnquiry
    const existingEnquiry = await prisma.contactEnquiry.findFirst({
      where: {
        email: cleanEmail,
        status: 'PENDING',
        subject: { startsWith: '[PARTNER_APPLICATION]' },
      },
    });

    if (existingEnquiry) {
      return res.status(400).json({
        success: false,
        message: 'Your partner application is already under review. We will contact you soon!',
      });
    }

    const applicationDetails = [
      `Partner Type: ${partnerType || 'General Advocate'}`,
      `Organization / Institution: ${organizationName || 'N/A'}`,
      `City: ${city || 'N/A'}`,
      `Mobile: ${cleanPhone}`,
      `Message: ${message || 'No additional message provided.'}`,
    ].join('\n');

    await prisma.contactEnquiry.create({
      data: {
        fullName: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        subject: `[PARTNER_APPLICATION] ${partnerType || 'General'} - ${name.trim()}`,
        message: applicationDetails,
        status: 'PENDING',
      },
    });

    // Send confirmation email
    sendPartnerApplicationConfirmation({
      recipientEmail: cleanEmail,
      applicantName: name.trim(),
    }).catch((err) => console.warn('[Partner App Email Notice]:', err.message));

    return res.status(201).json({
      success: true,
      message: 'Your partner application has been submitted successfully! We will review and contact you via email.',
    });
  } catch (error) {
    console.error('Error applying for partner:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit partner application. Please try again.' });
  }
};

/**
 * SuperAdmin: Get all Partner Applications
 */
export const getPartnerApplications = async (req, res) => {
  try {
    const applications = await prisma.contactEnquiry.findMany({
      where: {
        subject: { startsWith: '[PARTNER_APPLICATION]' },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching partner applications:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch partner applications.' });
  }
};

/**
 * SuperAdmin: Approve Partner Application and Generate Code
 */
export const approvePartnerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { partnerReferralCode, discountPercentage, discountType, discountValue } = req.body;

    const enquiry = await prisma.contactEnquiry.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Application enquiry not found.' });
    }

    // Check if partner already exists with this email
    const existingPartner = await prisma.referralPartner.findUnique({
      where: { email: enquiry.email },
    });

    if (existingPartner) {
      await prisma.contactEnquiry.update({
        where: { id: enquiry.id },
        data: { status: 'RESOLVED', resolutionNote: 'Partner was already created.' },
      });
      return res.status(400).json({ success: false, message: 'Partner already exists for this email.' });
    }

    // Generate or validate unique code
    let finalCode = partnerReferralCode ? partnerReferralCode.trim().toUpperCase() : '';
    if (!finalCode) {
      let isUnique = false;
      while (!isUnique) {
        finalCode = generateReferralCode();
        const existing = await prisma.referralPartner.findUnique({
          where: { partnerReferralCode: finalCode },
        });
        if (!existing) isUnique = true;
      }
    } else {
      const existing = await prisma.referralPartner.findUnique({
        where: { partnerReferralCode: finalCode },
      });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Referral code is already taken. Please choose another.' });
      }
    }

    const finalType = discountType === 'FLAT_AMOUNT' ? 'FLAT_AMOUNT' : 'PERCENTAGE';
    const rawVal = discountValue !== undefined && discountValue !== '' ? discountValue : discountPercentage;
    const finalVal = rawVal ? parseFloat(rawVal) : 10;

    // Strict validation: Flat amount cannot exceed plan price; percentage cannot exceed 100%
    const validation = await validateCommission(finalType, finalVal);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const newPartner = await prisma.referralPartner.create({
      data: {
        name: enquiry.fullName,
        email: enquiry.email,
        mobile: enquiry.phone,
        partnerReferralCode: finalCode,
        isActive: true,
      },
    });

    await prisma.coupon.create({
      data: {
        code: finalCode,
        discountType: finalType,
        discountValue: validation.value,
        isActive: true,
      },
    });

    // Mark enquiry resolved
    await prisma.contactEnquiry.update({
      where: { id: enquiry.id },
      data: {
        status: 'RESOLVED',
        resolutionNote: `Approved as Referral Partner with code ${finalCode}`,
        resolvedAt: new Date(),
      },
    });

    const clientBaseUrl = config.clientUrl || 'https://sakhisuraksha.veaglespace.com';
    const referralLink = `${clientBaseUrl}/auth?ref=${finalCode}`;

    // Send Approval Email to partner
    sendPartnerApplicationApproved({
      recipientEmail: enquiry.email,
      partnerName: enquiry.fullName,
      referralCode: finalCode,
      referralLink,
      discountPercentage: validation.value,
    }).catch((err) => console.warn('[Approve Email Notice]:', err.message));

    return res.status(200).json({
      success: true,
      message: `Partner approved successfully! Code ${finalCode} generated and email sent.`,
      partner: newPartner,
      referralCode: finalCode,
    });
  } catch (error) {
    console.error('Error approving partner application:', error);
    return res.status(500).json({ success: false, message: 'Failed to approve partner application.' });
  }
};

/**
 * Partner Portal Login (Direct Email or Mobile access)
 */
export const partnerLogin = async (req, res) => {
  try {
    const identifier = (req.body.email || req.body.identifier || req.body.mobile || '').trim();

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Registered email address or mobile number is required.',
      });
    }

    const cleanInput = identifier.toLowerCase();
    const cleanPhone = cleanInput.replace(/\D/g, '');

    const partner = await prisma.referralPartner.findFirst({
      where: {
        OR: [
          { email: cleanInput },
          ...(cleanPhone.length >= 10 ? [{ mobile: { endsWith: cleanPhone.slice(-10) } }] : []),
        ],
      },
      include: {
        referredUsers: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            subscriptionStatus: true,
            safetyStatus: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'No registered partner found with this email or mobile number.',
      });
    }

    if (!partner.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your partner account is currently inactive. Please contact support.',
      });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: partner.partnerReferralCode },
    });

    const token = jwt.sign(
      {
        id: partner.id,
        partnerId: partner.id,
        role: 'PARTNER',
        email: partner.email,
        code: partner.partnerReferralCode,
      },
      config.jwt.secret,
      { expiresIn: '30d' }
    );

    const clientBaseUrl = config.clientUrl || 'https://sakhisuraksha.veaglespace.com';
    const referralLink = `${clientBaseUrl}/auth?ref=${partner.partnerReferralCode}`;

    const totalReferred = partner.referredUsers.length;
    const activeSubscribers = partner.referredUsers.filter((u) => u.subscriptionStatus === 'ACTIVE').length;

    // Dynamic Plan & Commission Rate from Database
    const activePlan = await prisma.plan.findFirst({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
    const planPrice = activePlan ? Number(activePlan.basePrice || activePlan.totalPrice) : 24;

    const couponType = coupon ? coupon.discountType : 'PERCENTAGE';
    const couponVal = coupon ? Number(coupon.discountValue) : 10;

    let commissionRate = 10;
    let commissionPerUser = 2.4;

    if (couponType === 'FLAT_AMOUNT') {
      // SuperAdmin set a flat amount (e.g. ₹5 per user) -> convert to equivalent % for display
      commissionPerUser = couponVal;
      commissionRate = planPrice > 0 ? Number(((couponVal / planPrice) * 100).toFixed(1)) : 10;
    } else {
      // SuperAdmin set percentage (e.g. 10%)
      commissionRate = couponVal;
      commissionPerUser = Math.round(((planPrice * commissionRate) / 100) * 100) / 100;
    }

    const referredUserIds = partner.referredUsers.map((u) => u.id);
    let totalEarnings = 0;
    if (referredUserIds.length > 0) {
      const successfulPayments = await prisma.paymentHistory.findMany({
        where: {
          userId: { in: referredUserIds },
          status: 'SUCCESS',
        },
      });
      if (successfulPayments.length > 0) {
        if (couponType === 'FLAT_AMOUNT') {
          totalEarnings = successfulPayments.length * commissionPerUser;
        } else {
          const totalPaidAmount = successfulPayments.reduce((acc, p) => acc + (p.amount || p.baseAmount || 0), 0);
          totalEarnings = Math.round(((totalPaidAmount * commissionRate) / 100) * 100) / 100;
        }
      } else {
        totalEarnings = Math.round((activeSubscribers * commissionPerUser) * 100) / 100;
      }
    }

    const earnings = {
      commissionRate,
      commissionPerUser,
      commissionType: couponType,
      commissionValue: couponVal,
      planPrice,
      totalEarnings,
      paidEarnings: 0,
      pendingEarnings: totalEarnings,
    };

    return res.json({
      success: true,
      message: 'Logged in to Partner Portal successfully',
      token,
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        mobile: partner.mobile,
        partnerReferralCode: partner.partnerReferralCode,
        isActive: partner.isActive,
        discountPercentage: coupon ? coupon.discountValue : 10,
      },
      stats: {
        totalReferred,
        activeSubscribers,
      },
      earnings,
      referredUsers: partner.referredUsers,
      referralLink,
    });
  } catch (error) {
    console.error('Error logging in partner:', error);
    return res.status(500).json({ success: false, message: 'Partner login failed. Please try again.' });
  }
};

/**
 * Partner Dashboard Refresh
 */
export const getPartnerDashboard = async (req, res) => {
  try {
    if (req.user?.role !== 'PARTNER' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied: Partner credentials required.' });
    }

    const partnerId = req.user?.partnerId || req.user?.id;
    if (!partnerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized partner access' });
    }

    const partner = await prisma.referralPartner.findUnique({
      where: { id: parseInt(partnerId, 10) },
      include: {
        referredUsers: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            subscriptionStatus: true,
            safetyStatus: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner record not found' });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: partner.partnerReferralCode },
    });

    const clientBaseUrl = config.clientUrl || 'https://sakhisuraksha.veaglespace.com';
    const referralLink = `${clientBaseUrl}/auth?ref=${partner.partnerReferralCode}`;

    const totalReferred = partner.referredUsers.length;
    const activeSubscribers = partner.referredUsers.filter((u) => u.subscriptionStatus === 'ACTIVE').length;

    // Dynamic Commission & Plan from Database
    const activePlan = await prisma.plan.findFirst({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
    const planPrice = activePlan ? Number(activePlan.basePrice || activePlan.totalPrice) : 24;

    const couponType = coupon ? coupon.discountType : 'PERCENTAGE';
    const couponVal = coupon ? Number(coupon.discountValue) : 10;

    let commissionRate = 10;
    let commissionPerUser = 2.4;

    if (couponType === 'FLAT_AMOUNT') {
      // SuperAdmin set a flat amount (e.g. ₹5 per user) -> convert to equivalent % for display
      commissionPerUser = couponVal;
      commissionRate = planPrice > 0 ? Number(((couponVal / planPrice) * 100).toFixed(1)) : 10;
    } else {
      // SuperAdmin set percentage (e.g. 10%)
      commissionRate = couponVal;
      commissionPerUser = Math.round(((planPrice * commissionRate) / 100) * 100) / 100;
    }

    const referredUserIds = partner.referredUsers.map((u) => u.id);
    let totalEarnings = 0;
    if (referredUserIds.length > 0) {
      const successfulPayments = await prisma.paymentHistory.findMany({
        where: {
          userId: { in: referredUserIds },
          status: 'SUCCESS',
        },
      });
      if (successfulPayments.length > 0) {
        if (couponType === 'FLAT_AMOUNT') {
          totalEarnings = successfulPayments.length * commissionPerUser;
        } else {
          const totalPaidAmount = successfulPayments.reduce((acc, p) => acc + (p.amount || p.baseAmount || 0), 0);
          totalEarnings = Math.round(((totalPaidAmount * commissionRate) / 100) * 100) / 100;
        }
      } else {
        totalEarnings = Math.round((activeSubscribers * commissionPerUser) * 100) / 100;
      }
    }

    const paidEarnings = 0;
    const pendingEarnings = Math.max(0, totalEarnings - paidEarnings);

    const earnings = {
      commissionRate,
      commissionPerUser,
      commissionType: couponType,
      commissionValue: couponVal,
      planPrice,
      totalEarnings,
      paidEarnings,
      pendingEarnings,
    };

    return res.json({
      success: true,
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        mobile: partner.mobile,
        partnerReferralCode: partner.partnerReferralCode,
        isActive: partner.isActive,
        discountPercentage: coupon ? coupon.discountValue : 10,
      },
      stats: {
        totalReferred,
        activeSubscribers,
      },
      earnings,
      referredUsers: partner.referredUsers,
      referralLink,
    });
  } catch (error) {
    console.error('Error fetching partner dashboard:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch partner dashboard' });
  }
};

/**
 * Update Partner Profile (Self-service from Partner Settings)
 */
export const updatePartnerProfile = async (req, res) => {
  try {
    const partnerId = req.user?.partnerId || req.user?.id;
    if (!partnerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized partner access' });
    }

    const { name, mobile } = req.body;

    const updated = await prisma.referralPartner.update({
      where: { id: parseInt(partnerId, 10) },
      data: {
        ...(name && { name: name.trim() }),
        ...(mobile !== undefined && { mobile: mobile.trim() }),
      },
    });

    return res.json({
      success: true,
      message: 'Partner profile updated successfully',
      partner: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        mobile: updated.mobile,
        partnerReferralCode: updated.partnerReferralCode,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    console.error('Error updating partner profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to update partner profile' });
  }
};
