import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { qrData } = await req.json();

    if (!qrData) {
      return NextResponse.json({ error: 'No QR data provided.' }, { status: 400 });
    }

    let attendeeIdOrRegId = qrData;
    
    // In case the volunteer scanned the full JSON string from the QR code instead of typing the ID
    try {
      const parsed = JSON.parse(qrData);
      if (parsed.id) {
        attendeeIdOrRegId = parsed.id;
      }
    } catch (e) {
      // It's just a raw string, like INSP26-1234
    }

    // Find attendee
    const attendee = await prisma.attendee.findFirst({
      where: {
        OR: [
          { registrationId: attendeeIdOrRegId },
          { id: attendeeIdOrRegId }
        ]
      }
    });

    if (!attendee) {
      return NextResponse.json({ error: 'Attendee not found.' }, { status: 404 });
    }

    if (attendee.status === 'CHECKED_IN') {
      return NextResponse.json({ error: 'Attendee is already checked in.' }, { status: 400 });
    }

    // Process check-in
    const updatedAttendee = await prisma.attendee.update({
      where: { id: attendee.id },
      data: { status: 'CHECKED_IN' }
    });

    const attendance = await prisma.attendance.create({
      data: {
        attendeeId: attendee.id,
        checkedBy: 'System' // In real app, from session
      }
    });

    return NextResponse.json({ success: true, attendee: updatedAttendee, attendance });
  } catch (error: any) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Failed to process check-in.' }, { status: 500 });
  }
}
