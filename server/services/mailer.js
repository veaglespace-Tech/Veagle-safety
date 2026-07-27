import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

const transporter = nodemailer.createTransport({
  host: config.emailService.host,
  port: config.emailService.port,
  secure: false,
  auth: config.emailService.user ? {
    user: config.emailService.user,
    pass: config.emailService.pass,
  } : undefined,
});

export const sendEmailVerificationOtp = async ({ recipientEmail, userName, otp }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Veagle Safety" <${config.emailService.user || 'no-reply@veaglesafety.org'}>`,
      to: recipientEmail,
      subject: `🔐 Email Verification OTP for Veagle Safety`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <h2 style="color: #6366f1; text-align: center; margin-bottom: 24px;">Welcome to Veagle Safety</h2>
          <p style="font-size: 16px; color: #333333;">Hi <strong>${userName}</strong>,</p>
          <p style="font-size: 15px; color: #555555;">
            Thank you for registering. Please use the following 6-digit OTP code to verify your email address:
          </p>
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4f46e5;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #888888;">
            This OTP is valid for 10 minutes. If you did not request this, please ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
            &copy; ${new Date().getFullYear()} Veagle Safety SaaS. All rights reserved.
          </p>
        </div>
      `,
    });

    console.log(`[Email Service] Verification OTP sent to ${recipientEmail} (ID: ${info.messageId})`);
    return true;
  } catch (err) {
    console.error(`[Email Service Error] Failed to send OTP to ${recipientEmail}:`, err.message);
    return false;
  }
};

export const sendSosEmergencyAlert = async ({
  recipientEmail,
  recipientName,
  userName,
  trackingUrl,
  latitude,
  longitude,
}) => {
  try {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const info = await transporter.sendMail({
      from: `"Veagle Safety Emergency" <${config.emailService.user || 'sos@veaglesafety.org'}>`,
      to: recipientEmail,
      subject: `🚨 EMERGENCY SOS ALERT: ${userName} Needs Help Immediately!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #E62E5C; border-radius: 12px; padding: 24px; background-color: #FFF0F3;">
          <h1 style="color: #E62E5C; text-align: center;">🚨 EMERGENCY SOS ACTIVATED</h1>
          <p style="font-size: 16px; color: #1E122B;">Hi <strong>${recipientName}</strong>,</p>
          <p style="font-size: 16px; color: #1E122B;">
            <strong>${userName}</strong> has activated an Emergency SOS trigger on Veagle Safety and marked you as a trusted contact.
          </p>
          
          <div style="background: #ffffff; padding: 16px; border-radius: 8px; border-left: 4px solid #E62E5C; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; font-weight: bold;">Live GPS Tracking Link:</p>
            <p style="margin: 8px 0 0 0;">
              <a href="${trackingUrl}" style="background-color: #E62E5C; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                VIEW LIVE LOCATION MAP
              </a>
            </p>
          </div>

          <p style="font-size: 14px; color: #6C5D7C;">
            Direct Google Maps Coordinates: <a href="${mapUrl}">${latitude}, ${longitude}</a>
          </p>

          <hr style="border: 0; border-top: 1px solid #EADAFA; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6C5D7C; text-align: center;">
            This is an automated high-priority safety alert broadcast by Veagle Safety.
          </p>
        </div>
      `,
    });

    console.log(`[Email Service] Emergency alert sent to ${recipientEmail} (ID: ${info.messageId})`);
    return true;
  } catch (err) {
    console.error(`[Email Service Error] Failed to send to ${recipientEmail}:`, err.message);
    return false;
  }
};
