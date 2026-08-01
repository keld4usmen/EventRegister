import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// Generate a random registration ID like INSP26-0045
function generateRegistrationId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `INSP26-${randomNum}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      preferredName,
      gender,
      ageGroup,
      phone,
      email,
      location,
      attendingAs,
      company,
      jobTitle,
      industry,
      experienceYears,
      source,
      expectations,
      communicationConsent,
      mediaRelease,
      conductAgreement,
    } = body;

    // Check if email already exists
    const existing = await prisma.attendee.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email is already registered.' }, { status: 400 });
    }

    // Generate unique ID and QR string
    let registrationId = generateRegistrationId();
    // basic collision check (could be more robust)
    let collision = await prisma.attendee.findUnique({ where: { registrationId } });
    while (collision) {
      registrationId = generateRegistrationId();
      collision = await prisma.attendee.findUnique({ where: { registrationId } });
    }

    const qrCodeString = JSON.stringify({
      id: registrationId,
      name: fullName,
      email: email,
      event: 'Inspire Summit 2026'
    });

    const attendee = await prisma.attendee.create({
      data: {
        registrationId,
        fullName,
        preferredName,
        gender,
        ageGroup,
        phone,
        email,
        location,
        attendingAs,
        company,
        jobTitle,
        industry,
        experienceYears,
        source,
        expectations,
        communicationConsent,
        mediaRelease,
        conductAgreement,
        qrCodeString,
      },
    });

    // TODO: Send confirmation email here via Nodemailer

    return NextResponse.json({ success: true, id: attendee.id });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to process registration.' }, { status: 500 });
  }
}
