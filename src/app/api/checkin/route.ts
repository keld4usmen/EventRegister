import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { registrantId, checkedIn } = data;

    if (!registrantId) {
      return NextResponse.json({ error: "Registrant ID is required" }, { status: 400 });
    }

    const updatedRegistrant = await prisma.registrant.update({
      where: { id: registrantId },
      data: { checkedIn },
    });

    return NextResponse.json({ success: true, registrant: updatedRegistrant });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update check-in status" }, { status: 500 });
  }
}
