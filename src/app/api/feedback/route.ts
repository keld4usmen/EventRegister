import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { registrationId, experienceRating, speakerRating, comments } = body;

    // Verify registration ID
    const attendee = await prisma.attendee.findUnique({
      where: { registrationId }
    });

    if (!attendee) {
      return NextResponse.json({ error: 'Invalid Registration ID.' }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        attendeeId: attendee.id,
        experienceRating: parseInt(experienceRating),
        speakerRating: parseInt(speakerRating),
        comments
      }
    });

    return NextResponse.json({ success: true, id: feedback.id });
  } catch (error: any) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed to submit feedback.' }, { status: 500 });
  }
}
