import nodemailer from 'nodemailer';

// Configure the email transport using Nodemailer
// In production, configure environment variables (e.g. SMTP_HOST, SMTP_USER, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
    pass: process.env.SMTP_PASS || 'ethereal_password',
  },
});

export const sendConfirmationEmail = async (to: string, name: string, registrationId: string, qrLink: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"Inspire Summit 2026" <noreply@inspiresummit.com>',
      to,
      subject: 'INSPIRE SUMMIT 2026 Registration Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #8a2be2;">Welcome to Inspire Summit 2026!</h2>
          <p>Hi ${name},</p>
          <p>Your registration is confirmed. We are thrilled to have you join us.</p>
          
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Registration ID:</strong> ${registrationId}</p>
          </div>

          <p>Please click the link below to view and download your digital QR Ticket. You will need to present this at check-in.</p>
          <a href="${qrLink}" style="display: inline-block; padding: 10px 20px; background: #8a2be2; color: white; text-decoration: none; border-radius: 5px;">View My Ticket</a>

          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          
          <h3>Event Details</h3>
          <p><strong>Date:</strong> August 29, 2026</p>
          <p><strong>Time:</strong> 9:00 AM - 5:00 PM</p>
          <p><strong>Venue:</strong> Main Auditorium, Lagos, Nigeria</p>

          <p style="font-size: 0.9em; color: #666;">If you have any questions, please contact our support team.</p>
        </div>
      `,
    });

    console.log('Confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error };
  }
};
