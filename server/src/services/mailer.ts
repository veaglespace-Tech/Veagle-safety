import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: config.smtp.user ? {
    user: config.smtp.user,
    pass: config.smtp.pass,
  } : undefined,
});

export const sendEmergencyEmail = async (
  recipientEmail: string,
  recipientName: string,
  userName: string,
  userPhone: string,
  trackingUrl: string,
  isSilent: boolean = false
) => {
  const subject = `🚨 ${isSilent ? 'Silent Emergency Alert' : 'Emergency SOS'} – ${userName} Needs Help!`;
  
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFF8FB; border: 2px solid #D92D20; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #D92D20; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🚨 TICHI SURAKSHA EMERGENCY ALERT</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Immediate Assistance Requested</p>
      </div>
      
      <div style="padding: 24px; color: #241A20;">
        <p style="font-size: 16px; margin-top: 0;">Hello <strong>${recipientName}</strong>,</p>
        <p style="font-size: 16px;">
          <strong>${userName}</strong> (${userPhone}) has triggered an <strong>${isSilent ? 'SILENT EMERGENCY SOS' : 'EMERGENCY SOS'}</strong> on Tichi Suraksha.
        </p>
        
        <div style="background-color: #ffffff; border: 1px solid #E8A0BF; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #756A70;"><strong>Alert Time:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin: 0; font-size: 14px; color: #756A70;"><strong>Status:</strong> Live GPS Tracking Active</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${trackingUrl}" target="_blank" style="background-color: #6D214F; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 16px;">
            📍 VIEW LIVE LOCATION MAP
          </a>
        </div>

        <p style="font-size: 13px; color: #756A70; border-top: 1px solid #E8A0BF; padding-top: 16px; margin-bottom: 0;">
          If ${userName} is in immediate danger, please contact local emergency authorities (112) immediately.
        </p>
      </div>
    </div>
  `;

  try {
    if (config.smtp.user) {
      await transporter.sendMail({
        from: config.smtp.from,
        to: recipientEmail,
        subject,
        html,
      });
      console.log(`[SMTP] Emergency email sent to ${recipientEmail}`);
      return { success: true };
    } else {
      console.log(`[MOCK SMTP ALERT] Email to: ${recipientEmail} | Subject: ${subject} | Link: ${trackingUrl}`);
      return { success: true, mock: true };
    }
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send email to ${recipientEmail}:`, error);
    return { success: false, error };
  }
};
