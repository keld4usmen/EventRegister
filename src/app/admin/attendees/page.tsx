import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import AttendeesTable from '@/components/AttendeesTable';

export const dynamic = 'force-dynamic';

export default async function AttendeesAdminPage() {
  const attendees = await prisma.attendee.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Registered Attendees</h2>
      </div>

      <AttendeesTable attendees={attendees} />
    </div>
  );
}
