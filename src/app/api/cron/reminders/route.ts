import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const attendees = await prisma.attendee.findMany({
      where: { status: 'PENDING' } // Only send to pending check-in
    });

    const results = [];

    for (const attendee of attendees) {
      // In a real application, you would determine which reminder to send
      // (7 days, 3 days, 24 hours) based on the current date relative to the event date.
      
      // Simulate sending email
      // await transporter.sendMail({ ... })
      
      results.push({ email: attendee.email, status: 'simulated_success' });
    }

    return NextResponse.json({ success: true, processed: attendees.length, results }, { status: 200 });
  } catch (error: any) {
    console.error("Cron reminders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process reminders. " + error.message },
      { status: 500 }
    );
  }
}
