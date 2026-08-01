import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalRegistrants = await prisma.registrant.count();
    const checkedInCount = await prisma.registrant.count({ where: { checkedIn: true } });
    const prayerRequests = await prisma.registrant.count({ where: { prayerRequested: true } });

    // Business Stage breakdown
    const businessStagesRaw = await prisma.registrant.groupBy({
      by: ['businessStage'],
      _count: {
        businessStage: true,
      },
    });

    const businessStages = businessStagesRaw
      .filter((s: any) => s.businessStage) // remove nulls
      .map((s: any) => ({
        stage: s.businessStage,
        count: s._count.businessStage,
      }));

    return NextResponse.json({
      stats: {
        totalRegistrants,
        checkedInCount,
        prayerRequests,
        businessStages
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
