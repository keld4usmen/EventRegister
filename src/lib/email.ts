import nodemailer from "nodemailer";

/**
 * Gets a nodemailer transporter instance.
 * If real SMTP details are provided in environment variables, it uses those.
 * Otherwise, it automatically creates a test Ethereal email account.
 */
export async function getTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to Ethereal Email for local testing
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

/**
 * Helper function to send an email.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: '"Event App" <noreply@eventapp.com>',
      to,
      subject,
      html,
    });

    console.log("Message sent: %s", info.messageId);

    // If using Ethereal, log the preview URL for the user to easily check the email
    if (!process.env.SMTP_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
