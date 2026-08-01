import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { primaryName, primaryEmail, primaryPhone, businessStage, prayerRequested, guests } = data;

    // Start a transaction
    const group = await prisma.$transaction(async (tx: any) => {
      // 1. Create the Group
      const newGroup = await tx.group.create({
        data: {
          groupName: primaryName,
          totalGuestCount: guests ? guests.length : 0,
        },
      });

      // 2. Generate Master QR Code URL based on the Group ID
      // Assuming the app will be hosted somewhere, we use a placeholder or request origin in a real app
      const origin = req.headers.get("origin") || `http://${req.headers.get("host")}`;
      const qrCodeUrl = `${origin}/checkin?groupId=${newGroup.id}`;

      await tx.group.update({
        where: { id: newGroup.id },
        data: { masterQrCode: qrCodeUrl },
      });

      // 3. Create Primary Registrant
      await tx.registrant.create({
        data: {
          name: primaryName,
          email: primaryEmail,
          phone: primaryPhone,
          role: "Primary",
          businessStage: businessStage || null,
          prayerRequested: prayerRequested || false,
          groupId: newGroup.id,
        },
      });

      // 4. Create Guest Registrants (if any)
      if (guests && guests.length > 0) {
        const guestData = guests.map((guest: any) => ({
          name: guest.name,
          email: guest.email,
          role: "Guest",
          groupId: newGroup.id,
        }));
        
        await tx.registrant.createMany({
          data: guestData,
        });
      }

      return await tx.group.findUnique({
        where: { id: newGroup.id },
        include: { registrants: true },
      });
    });

    const origin = req.headers.get("origin") || `http://${req.headers.get("host")}`;
    
    // Send email to primary registrant
    await sendEmail({
      to: primaryEmail,
      subject: "Your Registration is Confirmed!",
      html: `
        <h2>Hi ${primaryName},</h2>
        <p>Your registration for the Event App is confirmed!</p>
        <p>Save this link to access your group's check-in QR Code when you arrive: <br/>
          <a href="${group.masterQrCode}">${group.masterQrCode}</a>
        </p>
        <p>Thank you!</p>
      `,
    });

    // Send emails to guest registrants
    const guestsCreated = group.registrants.filter((r: any) => r.role === "Guest");
    for (const guest of guestsCreated) {
      const guestLink = `${origin}/guest-completion/${guest.id}`;
      await sendEmail({
        to: guest.email,
        subject: "You've been invited to the Event App!",
        html: `
          <h2>Hi ${guest.name},</h2>
          <p>${primaryName} has registered you for the Event App.</p>
          <p>Please complete your profile by visiting the following link: <br/>
            <a href="${guestLink}">${guestLink}</a>
          </p>
          <p>Thank you!</p>
        `,
      });
    }

    return NextResponse.json({ success: true, group }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Registration failed. " + error.message },
      { status: 500 }
    );
  }
}
