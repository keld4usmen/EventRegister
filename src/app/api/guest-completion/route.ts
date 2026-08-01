import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { id, businessStage, prayerRequested } = data;

    if (!id || !businessStage) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedRegistrant = await prisma.registrant.update({
      where: { id },
      data: {
        businessStage,
        prayerRequested: prayerRequested || false,
      },
    });

    return NextResponse.json({ success: true, registrant: updatedRegistrant }, { status: 200 });
  } catch (error: any) {
    console.error("Guest completion error:", error);
    return NextResponse.json(
      { success: false, error: "Update failed. " + error.message },
      { status: 500 }
    );
  }
}
