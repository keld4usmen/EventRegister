import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import prisma from "@/lib/prisma";
import { sendGenericEmail } from '@/lib/email';
import { sendWhatsAppText } from '@/lib/whatsapp';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { channel, audience, subject, message } = await request.json();

    if (!channel || !audience || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Determine target attendees
    let whereClause = {};
    if (audience === 'CHECKED_IN') {
      whereClause = { status: 'CHECKED_IN' };
    } else if (audience === 'PENDING') {
      whereClause = { status: 'PENDING' };
    } else if (audience === 'UNPAID') {
      whereClause = { paymentStatus: 'UNPAID' };
    }

    const attendees = await prisma.attendee.findMany({
      where: whereClause,
      select: { id: true, email: true, phone: true, fullName: true, communicationConsent: true }
    });

    if (attendees.length === 0) {
      return NextResponse.json({ error: "No attendees found matching the audience." }, { status: 404 });
    }

    let successCount = 0;

    // In a real production app (for 10k+ users), this would be pushed to a queue (e.g. Redis/BullMQ)
    // For now, we'll map them, but this could hit Vercel timeout limits if there are thousands.
    const promises = attendees.map(async (attendee) => {
      // Respect consent
      if (!attendee.communicationConsent) {
        return;
      }

      let sent = false;

      if (channel === 'email' && attendee.email) {
        // Send email
        sent = await sendGenericEmail(
          attendee.email, 
          subject || "Update from Inspire 2026", 
          message.replace("{{name}}", attendee.fullName)
        );
      } else if (channel === 'whatsapp' && attendee.phone) {
        // Send WhatsApp
        sent = await sendWhatsAppText(
          attendee.phone, 
          message.replace("{{name}}", attendee.fullName)
        );
      }

      // Log the message
      if (sent) {
        successCount++;
        await prisma.messageLog.create({
          data: {
            attendeeId: attendee.id,
            type: channel.toUpperCase(),
            status: "SENT",
            content: message
          }
        });
      }
    });

    await Promise.allSettled(promises);

    return NextResponse.json({
      message: "Broadcast completed",
      count: successCount,
      totalAttempted: attendees.length
    }, { status: 200 });

  } catch (error) {
    console.error("Communication broadcast error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
