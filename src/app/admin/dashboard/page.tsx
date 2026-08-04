import prisma from "@/lib/prisma";
import DashboardClient from "@/components/admin/DashboardClient";

export const revalidate = 0; // Disable static caching for real-time dashboard

export default async function DashboardPage() {
  // Fetch real-time statistics
  const totalRegistrations = await prisma.attendee.count();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRegistrations = await prisma.attendee.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  const checkedIn = await prisma.attendee.count({
    where: {
      status: "CHECKED_IN",
    },
  });

  // Calculate some chart data
  const genderBreakdown = await prisma.attendee.groupBy({
    by: ["gender"],
    _count: {
      id: true,
    },
  });

  const occupationBreakdown = await prisma.attendee.groupBy({
    by: ["attendingAs"],
    _count: {
      id: true,
    },
  });

  const data = {
    totalRegistrations,
    todayRegistrations,
    checkedIn,
    attendanceRate: totalRegistrations > 0 ? Math.round((checkedIn / totalRegistrations) * 100) : 0,
    genderBreakdown: genderBreakdown.map((g) => ({ name: g.gender, value: g._count.id })),
    occupationBreakdown: occupationBreakdown.map((o) => ({ name: o.attendingAs, value: o._count.id })),
  };

  return <DashboardClient data={data} />;
}
