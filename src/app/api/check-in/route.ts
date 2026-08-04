import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { qrCodeString, registrationId } = body;

    if (!qrCodeString && !registrationId) {
      return NextResponse.json({ error: "No QR Code or Registration ID provided" }, { status: 400 });
    }

    // Find attendee
    const attendee = await prisma.attendee.findFirst({
      where: {
        OR: [
          { qrCodeString: qrCodeString || undefined },
          { registrationId: registrationId || undefined }
        ]
      },
      include: {
        attendance: true
      }
    });

    if (!attendee) {
      return NextResponse.json({ error: "Attendee not found. Invalid Ticket." }, { status: 404 });
    }

    if (attendee.status === "CHECKED_IN" || attendee.attendance) {
      return NextResponse.json({ 
        message: "Already Checked In", 
        attendee,
        warning: true
      }, { status: 200 });
    }

    // Mark as checked in
    const updatedAttendee = await prisma.$transaction(async (tx) => {
      const att = await tx.attendee.update({
        where: { id: attendee.id },
        data: { status: "CHECKED_IN" }
      });

      await tx.attendance.create({
        data: {
          attendeeId: att.id,
          checkedBy: session.user.id,
        }
      });

      return att;
    });

    return NextResponse.json({
      message: "Check-in successful",
      attendee: updatedAttendee,
      warning: false
    }, { status: 200 });

  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
