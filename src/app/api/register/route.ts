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

    // Send WhatsApp confirmation message if token and phone number ID are configured
    const waToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const waPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (waToken && waPhoneNumberId && phone) {
      try {
        // Ensure phone number starts with country code without + or 00 (e.g., 234 for Nigeria)
        const formattedPhone = phone.replace(/\D/g, ''); 

        const waResponse = await fetch(`https://graph.facebook.com/v20.0/${waPhoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${waToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: formattedPhone,
            type: "text",
            text: {
              body: `Hello ${preferredName || fullName},\n\nThank you for registering for Inspire Summit 2026!\n\nYour Registration ID is: ${registrationId}\n\nWe look forward to seeing you there!`
            }
          })
        });

        if (!waResponse.ok) {
          const waData = await waResponse.json();
          console.error('WhatsApp API Error:', waData);
        } else {
          // Log success if needed
          await prisma.messageLog.create({
            data: {
              attendeeId: attendee.id,
              type: 'WHATSAPP',
              status: 'SENT',
              content: 'Registration confirmation sent'
            }
          });
        }
      } catch (waError) {
        console.error('Failed to send WhatsApp message:', waError);
      }
    }

    // TODO: Send confirmation email here via Nodemailer

    return NextResponse.json({ success: true, id: attendee.id });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to process registration.' }, { status: 500 });
  }
}
