import React from 'react';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function SpeakersAdminPage() {
  const speakers = await prisma.speaker.findMany({
    orderBy: { createdAt: 'desc' }
  });

  async function addSpeaker(formData: FormData) {
    'use server';
    await prisma.speaker.create({
      data: {
        name: formData.get('name') as string,
        topic: formData.get('topic') as string,
        profile: (formData.get('profile') as string) || null,
        bio: (formData.get('bio') as string) || null,
        contact: (formData.get('contact') as string) || null,
        sessionTime: (formData.get('sessionTime') as string) || null,
      }
    });
    revalidatePath('/admin/speakers');
  }

  return (
    <div className="container animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>Manage Speakers</h1>
        <a href="/admin" className="btn btn-secondary">Back to Dashboard</a>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card">
          <h2>Add New Speaker</h2>
          <form action={addSpeaker} className="flex-col mt-4">
            <label className="label">Full Name *</label>
            <input type="text" name="name" required className="input" />
            
            <label className="label">Session Topic *</label>
            <input type="text" name="topic" required className="input" />
            
            <label className="label">Profile / Title</label>
            <input type="text" name="profile" className="input" placeholder="e.g. CEO at TechCorp" />
            
            <label className="label">Session Time</label>
            <input type="text" name="sessionTime" className="input" placeholder="e.g. 10:00 AM - 11:00 AM" />
            
            <label className="label">Bio</label>
            <textarea name="bio" className="input" rows={3}></textarea>
            
            <button type="submit" className="btn w-full">Add Speaker</button>
          </form>
        </div>

        <div className="glass-card" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <h2>Current Speakers ({speakers.length})</h2>
          {speakers.length === 0 ? <p>No speakers added yet.</p> : (
            <div className="mt-4">
              {speakers.map(s => (
                <div key={s.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--primary)' }}>{s.name}</h3>
                  <p style={{ margin: '0.2rem 0', fontWeight: 'bold' }}>{s.topic}</p>
                  <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', opacity: 0.8 }}>{s.profile}</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent)' }}>{s.sessionTime}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
