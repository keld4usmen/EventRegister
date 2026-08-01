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
    <div className="container animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>Registered Attendees</h1>
        <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      <AttendeesTable attendees={attendees} />
    </div>
  );
}
