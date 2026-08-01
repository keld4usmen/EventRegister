"use client";

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Attendee = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  attendingAs: string;
  registrationId: string;
  status: string;
  communicationConsent?: boolean;
  mediaRelease?: boolean;
  conductAgreement?: boolean;
};

export default function AttendeesTable({ attendees }: { attendees: Attendee[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAttendees = attendees.filter(a => {
    const term = searchTerm.toLowerCase();
    return (
      (a.fullName && a.fullName.toLowerCase().includes(term)) ||
      (a.email && a.email.toLowerCase().includes(term)) ||
      (a.registrationId && a.registrationId.toLowerCase().includes(term))
    );
  });

  const exportCSV = () => {
    const headers = ["Full Name", "Email", "Phone", "Category", "Registration ID", "Status", "Consents"];
    const csvRows = [headers.join(',')];

    filteredAttendees.forEach(a => {
      const consents = [
        a.communicationConsent ? 'Comm' : '',
        a.mediaRelease ? 'Media' : '',
        a.conductAgreement ? 'Conduct' : ''
      ].filter(Boolean).join(' | ');

      const row = [
        `"${a.fullName || ''}"`,
        `"${a.email || ''}"`,
        `"${a.phone || ''}"`,
        `"${a.attendingAs || ''}"`,
        `"${a.registrationId || ''}"`,
        `"${a.status || ''}"`,
        `"${consents}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = `attendees_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(csvUrl);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Registered Attendees", 14, 15);
    
    const tableData = filteredAttendees.map(a => {
      const consents = [
        a.communicationConsent ? 'Comm' : '',
        a.mediaRelease ? 'Media' : '',
        a.conductAgreement ? 'Conduct' : ''
      ].filter(Boolean).join(' | ');

      return [
        a.fullName || '',
        a.email || '',
        a.phone || '',
        a.attendingAs || '',
        a.registrationId || '',
        a.status.replace('_', ' ') || '',
        consents
      ];
    });

    autoTable(doc, {
      head: [["Full Name", "Email", "Phone", "Category", "Reg ID", "Status", "Consents"]],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 174, 239] }
    });

    doc.save(`attendees_export_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input 
          type="text" 
          placeholder="Search by name, email, or Reg ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded w-full md:w-1/3"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white'
          }}
        />
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            Export to CSV
          </button>
          <button onClick={exportPDF} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            Export to PDF
          </button>
        </div>
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
              <th style={{ padding: '1rem', color: 'var(--accent)' }}>Consents</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendees.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '1rem', textAlign: 'center' }}>No attendees match your search.</td>
              </tr>
            ) : (
              filteredAttendees.map(attendee => (
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
                  <td style={{ padding: '1rem', fontSize: '0.8rem' }}>
                    {[
                      attendee.communicationConsent ? 'Comm' : '',
                      attendee.mediaRelease ? 'Media' : '',
                      attendee.conductAgreement ? 'Conduct' : ''
                    ].filter(Boolean).join(' | ')}
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
