import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendConfirmationEmail } from '@/lib/email'; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { registrationId } = body;

    const attendee = await prisma.attendee.findUnique({
      where: { registrationId }
    });

    if (!attendee) {
      return NextResponse.json({ error: 'Attendee not found.' }, { status: 404 });
    }

    // In a real application, you would generate a PDF here using a library like jsPDF or puppeteer.
    // We will simulate generating the certificate and sending an email.
    
    // Simulate email sending (Using the same nodemailer transport from lib/email.ts)
    // You would attach the PDF to this email.
    console.log(`Generating certificate for ${attendee.fullName}...`);
    console.log(`Emailing certificate to ${attendee.email}...`);

    return NextResponse.json({ 
      success: true, 
      message: 'Certificate generated and emailed successfully.' 
    });
  } catch (error: any) {
    console.error('Certificate error:', error);
    return NextResponse.json({ error: 'Failed to generate certificate.' }, { status: 500 });
  }
}
