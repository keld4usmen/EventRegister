import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';

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

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
              <th style={{ padding: '1rem', color: 'var(--accent)' }}>Full Name</th>
              <th style={{ padding: '1rem', color: 'var(--accent)' }}>Email</th>
              <th style={{ padding: '1rem', color: 'var(--accent)' }}>Phone</th>
              <th style={{ padding: '1rem', color: 'var(--accent)' }}>Category</th>
              <th style={{ padding: '1rem', color: 'var(--accent)' }}>Registration ID</th>
              <th style={{ padding: '1rem', color: 'var(--accent)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '1rem', textAlign: 'center' }}>No attendees registered yet.</td>
              </tr>
            ) : (
              attendees.map(attendee => (
                <tr key={attendee.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{attendee.fullName}</td>
                  <td style={{ padding: '1rem' }}>{attendee.email}</td>
                  <td style={{ padding: '1rem' }}>{attendee.phone}</td>
                  <td style={{ padding: '1rem' }}>{attendee.attendingAs}</td>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--primary)' }}>{attendee.registrationId}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.8rem', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      background: attendee.status === 'CHECKED_IN' ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255,255,255,0.1)',
                      color: attendee.status === 'CHECKED_IN' ? 'var(--success)' : 'inherit'
                    }}>
                      {attendee.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
