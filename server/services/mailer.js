import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

const transporter = nodemailer.createTransport({
  host: config.emailService.host || 'smtp.gmail.com',
  port: config.emailService.port || 587,
  secure: false, // TLS
  auth: config.emailService.user ? {
    user: config.emailService.user,
    pass: config.emailService.pass,
  } : undefined,
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Send Email Verification OTP
 * Supports both object parameter { recipientEmail, userName, otp } or positional args (recipientEmail, userName, otp)
 */
export const sendEmailVerificationOtp = async (arg1, arg2, arg3) => {
  let recipientEmail, userName, otp;

  if (typeof arg1 === 'object' && arg1 !== null) {
    recipientEmail = arg1.recipientEmail || arg1.email;
    userName = arg1.userName || arg1.name;
    otp = arg1.otp;
  } else {
    recipientEmail = arg1;
    userName = arg2;
    otp = arg3;
  }

  console.log(`🔑 [OTP GENERATED] Email: ${recipientEmail} | OTP Code: ${otp}`);

  try {
    const info = await transporter.sendMail({
      from: `"Sakhi Suraksha SOS" <${config.emailService.user || 'no-reply@sakhisuraksha.org'}>`,
      to: recipientEmail,
      subject: `🔐 Email Verification OTP: ${otp} - Sakhi Suraksha SOS`,
      html: `
        <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #FF5C8A; border-radius: 16px; padding: 32px; background-color: #FFF0F3;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #2A0826; font-size: 26px; font-weight: 900; margin: 0;">Sakhi Suraksha SOS</h1>
            <p style="color: #FF5C8A; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">24/7 Women & Personal Safety Platform</p>
          </div>
          
          <div style="background-color: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #FFCCE1;">
            <p style="font-size: 16px; color: #2A0826; margin-top: 0;">Hi <strong>${userName || 'Sakhi Member'}</strong>,</p>
            <p style="font-size: 14px; color: #555555; leading-height: 1.6;">
              Thank you for registering on Sakhi Suraksha SOS. Please use the following 6-digit OTP code to verify your email address and activate your safety account:
            </p>
            
            <div style="background: linear-gradient(135deg, #FF5C8A, #FF2A6D); border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; shadow: 0 4px 12px rgba(255,92,138,0.3);">
              <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ffffff;">${otp}</span>
            </div>
            
            <p style="font-size: 12px; color: #888888; margin-bottom: 0;">
              ⏰ This OTP is valid for 10 minutes. If you did not request this registration, please ignore this email.
            </p>
          </div>

          <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #888888;">
            &copy; ${new Date().getFullYear()} Sakhi Suraksha SOS Platform. All rights reserved.
          </div>
        </div>
      `,
    });

    console.log(`[Email Service] Verification OTP sent successfully to ${recipientEmail} (ID: ${info.messageId})`);
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
      from: `"Sakhi Suraksha SOS Emergency" <${config.emailService.user || 'sos@sakhisuraksha.org'}>`,
      to: recipientEmail,
      subject: `🚨 EMERGENCY SOS ALERT: ${userName} Needs Help Immediately!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #FF2A6D; border-radius: 12px; padding: 24px; background-color: #FFF0F3;">
          <h1 style="color: #FF2A6D; text-align: center;">🚨 EMERGENCY SOS ACTIVATED</h1>
          <p style="font-size: 16px; color: #2A0826;">Hi <strong>${recipientName}</strong>,</p>
          <p style="font-size: 16px; color: #2A0826;">
            <strong>${userName}</strong> has activated an Emergency SOS trigger on Sakhi Suraksha SOS and marked you as a trusted contact.
          </p>
          
          <div style="background: #ffffff; padding: 16px; border-radius: 8px; border-left: 4px solid #FF2A6D; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; font-weight: bold;">Live GPS Tracking Link:</p>
            <p style="margin: 8px 0 0 0;">
              <a href="${trackingUrl}" style="background-color: #FF2A6D; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                VIEW LIVE LOCATION MAP
              </a>
            </p>
          </div>

          <p style="font-size: 14px; color: #555555;">
            Direct Google Maps Coordinates: <a href="${mapUrl}">${latitude}, ${longitude}</a>
          </p>

          <hr style="border: 0; border-top: 1px solid #FFCCE1; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888888; text-align: center;">
            This is an automated high-priority safety alert broadcast by Sakhi Suraksha SOS.
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
