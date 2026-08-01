import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  if (!groupId) {
    return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
  }

  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        registrants: {
          orderBy: { role: 'desc' } // Primary first
        }
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({ group });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch group" }, { status: 500 });
  }
}
