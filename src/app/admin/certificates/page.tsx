"use client";

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Download, Award, Search, CheckCircle } from 'lucide-react';

export default function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock checked-in attendees for the UI. In a real component, fetch from the database.
  const [attendees] = useState([
    { id: '1', fullName: 'John Doe', email: 'john@example.com', registrationId: 'INSP26-0001', status: 'CHECKED_IN', certificateSent: false },
    { id: '2', fullName: 'Jane Smith', email: 'jane@example.com', registrationId: 'INSP26-0002', status: 'CHECKED_IN', certificateSent: true },
  ]);

  const generateCertificate = (name: string) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Background Color
    doc.setFillColor(0, 75, 135); // Deep blue
    doc.rect(0, 0, 297, 210, 'F');
    
    // Inner border
    doc.setDrawColor(242, 108, 34); // Orange
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE OF ATTENDANCE', 148.5, 50, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', 148.5, 75, { align: 'center' });

    // Name
    doc.setTextColor(0, 174, 239); // Cyan
    doc.setFontSize(45);
    doc.setFont('helvetica', 'bold');
    doc.text(name.toUpperCase(), 148.5, 105, { align: 'center' });

    // Body
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully attended and participated in the', 148.5, 130, { align: 'center' });
    
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('INSPIRE SUMMIT 2026', 148.5, 145, { align: 'center' });

    // Signatures
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('_______________________', 60, 180, { align: 'center' });
    doc.text('Event Director', 60, 188, { align: 'center' });
    
    doc.text('_______________________', 237, 180, { align: 'center' });
    doc.text('Lead Speaker', 237, 188, { align: 'center' });

    doc.save(`${name.replace(' ', '_')}_Certificate.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Certificates & Badges</h2>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search checked-in attendees..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#00aeef]"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2 bg-[#f26c22] rounded-lg font-medium hover:bg-[#f26c22]/90 transition-colors">
            <Award size={18} /> Generate All Certificates
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/20 border-b border-white/10 text-gray-300">
              <tr>
                <th className="p-4 font-medium">Attendee Name</th>
                <th className="p-4 font-medium">Registration ID</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {attendees.map(attendee => (
                <tr key={attendee.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-white">{attendee.fullName}</p>
                    <p className="text-xs text-gray-400">{attendee.email}</p>
                  </td>
                  <td className="p-4 font-mono text-[#00aeef]">{attendee.registrationId}</td>
                  <td className="p-4">
                    {attendee.certificateSent ? (
                      <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                        <CheckCircle size={14} /> Sent via Email
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Not generated yet</span>
                    )}
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button 
                      onClick={() => generateCertificate(attendee.fullName)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#004b87] text-white rounded-lg hover:bg-[#004b87]/80 transition-colors"
                    >
                      <Download size={14} /> Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
