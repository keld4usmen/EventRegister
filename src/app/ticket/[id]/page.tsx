import React from 'react';
import prisma from '../../../lib/prisma';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const attendee = await prisma.attendee.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!attendee) {
    return (
      <div className="container text-center mt-4">
        <h1>Ticket Not Found</h1>
        <p>We could not locate this ticket. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div className="glass-card animate-fade-in text-center" style={{ width: '100%', marginTop: '2rem' }}>
        
        <div style={{ padding: '1rem', background: 'var(--primary)', borderRadius: '12px 12px 0 0', margin: '-2rem -2rem 2rem -2rem' }}>
          <h2 style={{ margin: 0, color: 'white' }}>INSPIRE SUMMIT 2026</h2>
          <p style={{ margin: 0, opacity: 0.8 }}>Digital Ticket</p>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{attendee.fullName.toUpperCase()}</h1>
        <p style={{ color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '2rem' }}>
          {attendee.attendingAs.toUpperCase()}
        </p>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', display: 'inline-block', marginBottom: '2rem' }}>
          <QRCodeSVG 
            value={attendee.qrCodeString} 
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"M"}
          />
        </div>

        <div className="flex justify-between" style={{ textAlign: 'left', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
          <div>
            <p className="label" style={{ marginBottom: '0.2rem' }}>Registration ID</p>
            <p style={{ fontWeight: 'bold' }}>{attendee.registrationId}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="label" style={{ marginBottom: '0.2rem' }}>Date</p>
            <p style={{ fontWeight: 'bold' }}>29 August 2026</p>
          </div>
        </div>

      </div>

      <Link href="/" className="btn btn-secondary" style={{ marginTop: '2rem' }}>
        Return to Home
      </Link>
    </div>
  );
}
