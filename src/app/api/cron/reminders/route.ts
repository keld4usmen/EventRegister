import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    // In a real app, you'd want to secure this endpoint (e.g. check a cron secret)
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    const registrants = await prisma.registrant.findMany();

    const results = [];

    for (const reg of registrants) {
      // Base message
      let htmlMessage = `
        <h2>Hi ${reg.name},</h2>
        <p>We are so excited to see you tomorrow at the Event App Summit!</p>
        <p>Please make sure you have your check-in QR code ready (if you are the Primary registrant, you received this in your confirmation email. Guests, your primary will scan you in!).</p>
        <hr />
        <h3>Your Custom Resource Pack</h3>
        <ul>
      `;

      // Resource Pack Logic
      if (reg.prayerRequested) {
        htmlMessage += `<li><strong>Spiritual Resource Link:</strong> <a href="https://example.com/spiritual-resource">Download Here</a></li>`;
      }

      if (reg.businessStage === "Idea") {
        htmlMessage += `<li><strong>Startup Guide Link:</strong> <a href="https://example.com/startup-guide">Download Here</a></li>`;
      }

      if (!reg.prayerRequested && reg.businessStage !== "Idea") {
        htmlMessage += `<li><em>No specific resources matched your profile right now, but we have plenty waiting for you at the event!</em></li>`;
      }

      htmlMessage += `
        </ul>
        <br/>
        <p>See you tomorrow!</p>
      `;

      // Send the email
      const emailResult = await sendEmail({
        to: reg.email,
        subject: "See you tomorrow at the Summit!",
        html: htmlMessage,
      });

      results.push({ email: reg.email, success: emailResult.success });
    }

    return NextResponse.json({ success: true, processed: registrants.length, results }, { status: 200 });
  } catch (error: any) {
    console.error("Cron reminders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process reminders. " + error.message },
      { status: 500 }
    );
  }
}
