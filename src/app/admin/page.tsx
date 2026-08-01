import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch Analytics Data
  const totalRegistrations = await prisma.attendee.count();
  const checkedIn = await prisma.attendee.count({ where: { status: 'CHECKED_IN' } });
  
  const attendancePercentage = totalRegistrations === 0 ? 0 : Math.round((checkedIn / totalRegistrations) * 100);

  // Group by Category
  const byCategory = await prisma.attendee.groupBy({
    by: ['attendingAs'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } }
  });

  // Group by Source
  const bySource = await prisma.attendee.groupBy({
    by: ['source'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } }
  });

  return (
    <div className="container animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/admin/attendees" className="btn btn-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
            View All Attendees
          </Link>
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px' }}>
            Role: <span style={{ color: 'var(--success)' }}>Super Admin</span>
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-6 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="glass-card text-center" style={{ padding: '1.5rem' }}>
          <p className="label">Total Registrations</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{totalRegistrations}</p>
        </div>
        <div className="glass-card text-center" style={{ padding: '1.5rem' }}>
          <p className="label">Checked In</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{checkedIn}</p>
        </div>
        <div className="glass-card text-center" style={{ padding: '1.5rem' }}>
          <p className="label">Pending</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>{totalRegistrations - checkedIn}</p>
        </div>
        <div className="glass-card text-center" style={{ padding: '1.5rem' }}>
          <p className="label">Attendance Rate</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{attendancePercentage}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Professional Categories */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            Professional Demographics
          </h2>
          {byCategory.length === 0 ? <p>No data yet.</p> : (
            <ul style={{ listStyle: 'none' }}>
              {byCategory.map(item => (
                <li key={item.attendingAs} className="flex justify-between mb-2 p-2" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                  <span>{item.attendingAs || 'Unknown'}</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{item._count.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Marketing Attribution */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            Marketing Attribution
          </h2>
          {bySource.length === 0 ? <p>No data yet.</p> : (
            <ul style={{ listStyle: 'none' }}>
              {bySource.map(item => (
                <li key={item.source} className="flex justify-between mb-2 p-2" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                  <span>{item.source || 'Unknown'}</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{item._count.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* AI Insights Mock */}
      <div className="glass-card mt-4" style={{ borderLeft: '4px solid #00f2fe' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>✨ AI Expectations Insights</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>
          Based on <strong>{totalRegistrations}</strong> registration inputs, the top 3 requested topics are:
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <span style={{ background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', padding: '0.5rem 1rem', borderRadius: '20px' }}>Business Scaling</span>
          <span style={{ background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', padding: '0.5rem 1rem', borderRadius: '20px' }}>Spiritual Leadership</span>
          <span style={{ background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', padding: '0.5rem 1rem', borderRadius: '20px' }}>Networking</span>
        </div>
      </div>

    </div>
  );
}
