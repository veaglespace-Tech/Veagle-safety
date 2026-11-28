import { prisma } from '../config/prisma.js';
import crypto from 'crypto';
import {
  sendVolunteerOtp,
  sendVolunteerApplicationReceived,
  sendVolunteerApproved,
  sendVolunteerRejected,
} from '../services/mailer.js';

/**
 * Generate a unique volunteer badge code e.g. VOL-2026-A1B2
 */
const generateVolunteerIdCode = async () => {
  const year = new Date().getFullYear();
  let isUnique = false;
  let code = '';
  while (!isUnique) {
    const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase();
    code = `VOL-${year}-${randomHex}`;
    const existing = await prisma.volunteer.findUnique({
      where: { volunteerIdCode: code },
    });
    if (!existing) isUnique = true;
  }
  return code;
};

/**
 * Public: Send 6-digit OTP for email verification before volunteer submission
 */
export const sendOtp = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const fullName = (req.body.fullName || req.body.name || '').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });
    }

    // Check if an approved volunteer already exists with this email
    const existing = await prisma.volunteer.findUnique({ where: { email } });
    if (existing && existing.status === 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'An active approved volunteer is already registered with this email.',
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existing) {
      await prisma.volunteer.update({
        where: { email },
        data: {
          fullName: fullName || existing.fullName,
          emailOtp: otp,
          emailOtpExpiresAt: otpExpires,
          isEmailVerified: false,
        },
      });
    } else {
      await prisma.volunteer.create({
        data: {
          fullName: fullName || 'Volunteer Applicant',
          email,
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          emailOtp: otp,
          emailOtpExpiresAt: otpExpires,
          isEmailVerified: false,
          status: 'PENDING',
        },
      });
    }

    // Send email with OTP and await dispatch
    const mailSent = await sendVolunteerOtp({
      recipientEmail: email,
      volunteerName: fullName || 'Volunteer',
      otp,
    });

    if (!mailSent) {
      return res.status(500).json({
        success: false,
        message: 'Could not dispatch verification email right now. Please try again in a moment.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${email}. Valid for 10 minutes.`,
    });
  } catch (error) {
    console.error('Error sending volunteer OTP:', error);
    return res.status(500).json({ success: false, message: 'Failed to send verification code. Please try again.' });
  }
};

/**
 * Public: Verify 6-digit email OTP
 */
export const verifyOtp = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const otp = (req.body.otp || '').trim();

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit OTP code are required.' });
    }

    const volunteer = await prisma.volunteer.findUnique({ where: { email } });
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'No registration request found for this email.' });
    }

    if (!volunteer.emailOtp || volunteer.emailOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid verification code. Please check and re-enter.' });
    }

    if (volunteer.emailOtpExpiresAt && new Date() > new Date(volunteer.emailOtpExpiresAt)) {
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }

    // Mark email as verified
    await prisma.volunteer.update({
      where: { email },
      data: {
        isEmailVerified: true,
        emailOtp: null,
        emailOtpExpiresAt: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Email address verified successfully!',
    });
  } catch (error) {
    console.error('Error verifying volunteer OTP:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify OTP code.' });
  }
};

/**
 * Public: Submit Complete Volunteer Application
 */
export const applyVolunteer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      gender,
      dateOfBirth,
      occupation,
      skills,
      availability,
      emergencyContactName,
      emergencyContactPhone,
      motivation,
    } = req.body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();

    if (!fullName || !cleanEmail || !cleanPhone || !address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Full Name, Email, Phone, Address, City, State, and Pincode are all required.',
      });
    }

    const existing = await prisma.volunteer.findUnique({ where: { email: cleanEmail } });

    // Ensure email was verified via OTP
    if (!existing || !existing.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email address using the 6-digit OTP code before submitting.',
      });
    }

    if (existing.status === 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'You are already registered and approved as a Sakhi Suraksha Volunteer!',
      });
    }

    const updatedVolunteer = await prisma.volunteer.update({
      where: { email: cleanEmail },
      data: {
        fullName: fullName.trim(),
        phone: cleanPhone,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        country: (country || 'India').trim(),
        gender: gender || null,
        dateOfBirth: dateOfBirth || null,
        occupation: occupation || null,
        skills: skills || null,
        availability: availability || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        motivation: motivation || null,
        status: 'PENDING',
        rejectionReason: null,
      },
    });

    // Send confirmation email
    sendVolunteerApplicationReceived({
      recipientEmail: cleanEmail,
      volunteerName: fullName,
      city,
    }).catch((err) => console.warn('[Volunteer Mail Notice]:', err.message));

    return res.status(200).json({
      success: true,
      message: 'Volunteer application submitted successfully! SuperAdmin will review your request.',
      volunteer: updatedVolunteer,
    });
  } catch (error) {
    console.error('Error submitting volunteer application:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit volunteer application.' });
  }
};

/**
 * SuperAdmin: Get All Volunteers with filters, counts, and search
 */
export const getAllVolunteers = async (req, res) => {
  try {
    const { status, search, city, state } = req.query;

    const whereClause = {
      // Exclude unverified placeholder registrations that haven't actually applied
      NOT: { phone: '' },
      ...(status && status !== 'ALL' ? { status } : {}),
      ...(city ? { city: { contains: city } } : {}),
      ...(state ? { state: { contains: state } } : {}),
      ...(search
        ? {
            OR: [
              { fullName: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } },
              { city: { contains: search } },
              { state: { contains: search } },
              { volunteerIdCode: { contains: search } },
            ],
          }
        : {}),
    };

    const [volunteers, totalVolunteers, pendingCount, approvedCount, rejectedCount, inactiveCount] = await Promise.all([
      prisma.volunteer.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.volunteer.count({ where: { NOT: { phone: '' } } }),
      prisma.volunteer.count({ where: { status: 'PENDING', NOT: { phone: '' } } }),
      prisma.volunteer.count({ where: { status: 'APPROVED' } }),
      prisma.volunteer.count({ where: { status: 'REJECTED' } }),
      prisma.volunteer.count({ where: { status: 'INACTIVE' } }),
    ]);

    return res.status(200).json({
      success: true,
      volunteers,
      counts: {
        total: totalVolunteers,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        inactive: inactiveCount,
      },
    });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch volunteers.' });
  }
};

/**
 * SuperAdmin: Get Volunteer by ID
 */
export const getVolunteerById = async (req, res) => {
  try {
    const { id } = req.params;
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: parseInt(id) },
    });

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer record not found.' });
    }

    return res.status(200).json({ success: true, volunteer });
  } catch (error) {
    console.error('Error fetching volunteer by ID:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch volunteer details.' });
  }
};

/**
 * SuperAdmin: Approve Volunteer Application
 */
export const approveVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const volunteerId = parseInt(id);

    const volunteer = await prisma.volunteer.findUnique({ where: { id: volunteerId } });
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found.' });
    }

    // Generate unique volunteer badge code if not already assigned
    const idCode = volunteer.volunteerIdCode || (await generateVolunteerIdCode());

    const updated = await prisma.volunteer.update({
      where: { id: volunteerId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        volunteerIdCode: idCode,
        rejectionReason: null,
      },
    });

    // Send official approval email with badge ID
    sendVolunteerApproved({
      recipientEmail: updated.email,
      volunteerName: updated.fullName,
      volunteerIdCode: idCode,
      city: updated.city,
    }).catch((err) => console.warn('[Approve Email Notice]:', err.message));

    return res.status(200).json({
      success: true,
      message: `Volunteer ${updated.fullName} approved successfully! Badge ID: ${idCode}`,
      volunteer: updated,
    });
  } catch (error) {
    console.error('Error approving volunteer:', error);
    return res.status(500).json({ success: false, message: 'Failed to approve volunteer application.' });
  }
};

/**
 * SuperAdmin: Reject Volunteer Application
 */
export const rejectVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const volunteerId = parseInt(id);

    const volunteer = await prisma.volunteer.findUnique({ where: { id: volunteerId } });
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found.' });
    }

    const updated = await prisma.volunteer.update({
      where: { id: volunteerId },
      data: {
        status: 'REJECTED',
        rejectionReason: reason || 'Application criteria requirements were not met.',
      },
    });

    // Send rejection notice
    sendVolunteerRejected({
      recipientEmail: updated.email,
      volunteerName: updated.fullName,
      reason: updated.rejectionReason,
    }).catch((err) => console.warn('[Reject Email Notice]:', err.message));

    return res.status(200).json({
      success: true,
      message: `Volunteer application for ${updated.fullName} has been rejected.`,
      volunteer: updated,
    });
  } catch (error) {
    console.error('Error rejecting volunteer:', error);
    return res.status(500).json({ success: false, message: 'Failed to reject volunteer application.' });
  }
};

/**
 * SuperAdmin: Update Volunteer details or status (e.g. toggle APPROVED <-> INACTIVE)
 */
export const updateVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const volunteerId = parseInt(id);

    const {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      gender,
      occupation,
      skills,
      availability,
      emergencyContactName,
      emergencyContactPhone,
      motivation,
      status,
      notes,
    } = req.body;

    const existing = await prisma.volunteer.findUnique({ where: { id: volunteerId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Volunteer not found.' });
    }

    const updated = await prisma.volunteer.update({
      where: { id: volunteerId },
      data: {
        ...(fullName && { fullName }),
        ...(email && { email: email.toLowerCase() }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(pincode && { pincode }),
        ...(country && { country }),
        ...(gender !== undefined && { gender }),
        ...(occupation !== undefined && { occupation }),
        ...(skills !== undefined && { skills }),
        ...(availability !== undefined && { availability }),
        ...(emergencyContactName !== undefined && { emergencyContactName }),
        ...(emergencyContactPhone !== undefined && { emergencyContactPhone }),
        ...(motivation !== undefined && { motivation }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Volunteer profile updated successfully.',
      volunteer: updated,
    });
  } catch (error) {
    console.error('Error updating volunteer:', error);
    return res.status(500).json({ success: false, message: 'Failed to update volunteer profile.' });
  }
};

/**
 * SuperAdmin: Delete Volunteer record
 */
export const deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const volunteerId = parseInt(id);

    await prisma.volunteer.delete({
      where: { id: volunteerId },
    });

    return res.status(200).json({
      success: true,
      message: 'Volunteer record deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete volunteer record.' });
  }
};
