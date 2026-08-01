'use client';

import React, { useState } from 'react';

export default function CheckinPage() {
  const [scanData, setScanData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanData) return;

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: scanData })
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setScanData(''); // clear input for next scan
      } else {
        setError(data.error || 'Failed to check in.');
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="glass-card animate-fade-in text-center" style={{ marginTop: '2rem' }}>
        <h1 style={{ color: 'var(--success)' }}>Volunteer Check-in</h1>
        <p className="mb-4">Scan QR Code or Enter Registration ID</p>

        {error && (
          <div style={{ background: 'rgba(255, 75, 75, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleCheckIn} className="flex-col" style={{ marginBottom: '2rem' }}>
          <input 
            type="text" 
            value={scanData} 
            onChange={(e) => setScanData(e.target.value)} 
            className="input text-center" 
            placeholder="e.g. INSP26-1234 or pasted QR string"
            style={{ fontSize: '1.2rem', letterSpacing: '2px' }}
            autoFocus
          />
          <button type="submit" className="btn w-full" disabled={isProcessing}>
            {isProcessing ? 'Verifying...' : 'Check-in Attendee'}
          </button>
        </form>

        {result && (
          <div className="animate-fade-in" style={{ background: 'rgba(0, 230, 118, 0.1)', border: '1px solid var(--success)', padding: '2rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '4rem', color: 'var(--success)', lineHeight: '1' }}>✓</div>
            <h2 style={{ color: 'var(--success)', margin: '1rem 0' }}>VERIFIED</h2>
            
            <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px' }}>
              <p className="label">Name</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{result.attendee.fullName}</p>
              
              <p className="label">Category</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{result.attendee.attendingAs}</p>
              
              <p className="label">Registration ID</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--accent)' }}>{result.attendee.registrationId}</p>
              
              <p className="label">Check-in Time</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{new Date(result.attendance.checkinTime).toLocaleTimeString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
