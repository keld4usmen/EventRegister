import React from 'react';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function SponsorsAdminPage() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: { createdAt: 'desc' }
  });

  async function addSponsor(formData: FormData) {
    'use server';
    await prisma.sponsor.create({
      data: {
        company: formData.get('company') as string,
        package: formData.get('package') as string,
        status: (formData.get('status') as string) || 'PENDING',
        logoUrl: (formData.get('logoUrl') as string) || null,
        contactPerson: (formData.get('contactPerson') as string) || null,
      }
    });
    revalidatePath('/admin/sponsors');
  }

  return (
    <div className="container animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>Manage Sponsors</h1>
        <a href="/admin" className="btn btn-secondary">Back to Dashboard</a>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card">
          <h2>Add New Sponsor</h2>
          <form action={addSponsor} className="flex-col mt-4">
            <label className="label">Company Name *</label>
            <input type="text" name="company" required className="input" />
            
            <label className="label">Sponsorship Package *</label>
            <select name="package" required className="input">
              <option value="">Select Package</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
            
            <label className="label">Status</label>
            <select name="status" className="input">
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PAID">Paid</option>
            </select>

            <label className="label">Contact Person</label>
            <input type="text" name="contactPerson" className="input" placeholder="e.g. Jane Doe" />
            
            <button type="submit" className="btn w-full">Add Sponsor</button>
          </form>
        </div>

        <div className="glass-card" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <h2>Current Sponsors ({sponsors.length})</h2>
          {sponsors.length === 0 ? <p>No sponsors added yet.</p> : (
            <div className="mt-4">
              {sponsors.map(s => (
                <div key={s.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--primary)' }}>{s.company}</h3>
                    <p style={{ margin: '0.2rem 0', fontWeight: 'bold' }}>{s.package} Package</p>
                    <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', opacity: 0.8 }}>Contact: {s.contactPerson || 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: s.status === 'PAID' ? 'var(--success)' : (s.status === 'CONFIRMED' ? 'var(--accent)' : 'var(--danger)'),
                      color: s.status === 'PENDING' ? 'white' : 'black'
                    }}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
