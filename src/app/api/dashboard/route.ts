import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalRegistrants = await prisma.attendee.count();
    const checkedInCount = await prisma.attendee.count({ where: { status: 'CHECKED_IN' } });
    
    // Professional Demographics breakdown
    const businessStagesRaw = await prisma.attendee.groupBy({
      by: ['attendingAs'],
      _count: {
        id: true,
      },
    });

    const businessStages = businessStagesRaw
      .filter((s: any) => s.attendingAs)
      .map((s: any) => ({
        stage: s.attendingAs,
        count: s._count.id,
      }));

    return NextResponse.json({
      stats: {
        totalRegistrants,
        checkedInCount,
        businessStages
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
