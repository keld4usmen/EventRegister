"use client";

import React, { useState } from 'react';
import { Search, Download, Trash, Mail, MessageCircle, Armchair, ChevronDown } from 'lucide-react';
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
  paymentStatus?: string;
  seatId?: string | null;
  communicationConsent?: boolean;
  mediaRelease?: boolean;
  conductAgreement?: boolean;
};

export default function AttendeesTable({ attendees }: { attendees: Attendee[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const filteredAttendees = attendees.filter(a => {
    const term = searchTerm.toLowerCase();
    return (
      (a.fullName && a.fullName.toLowerCase().includes(term)) ||
      (a.email && a.email.toLowerCase().includes(term)) ||
      (a.registrationId && a.registrationId.toLowerCase().includes(term))
    );
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAttendees.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAttendees.map(a => a.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const exportCSV = () => {
    const headers = ["Full Name", "Email", "Phone", "Category", "Registration ID", "Status", "Payment", "Consents"];
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
        `"${a.paymentStatus || 'UNPAID'}"`,
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
        a.paymentStatus || 'UNPAID',
        consents
      ];
    });

    autoTable(doc, {
      head: [["Full Name", "Email", "Phone", "Category", "Reg ID", "Status", "Payment", "Consents"]],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 174, 239] }
    });

    doc.save(`attendees_export_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const executeBulkAction = (action: string) => {
    if (selectedIds.size === 0) return alert("Select at least one attendee.");
    alert(`Bulk Action: ${action} for ${selectedIds.size} attendees. (Mocked for now)`);
    setIsBulkOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or Reg ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#00aeef]"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Bulk Actions Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsBulkOpen(!isBulkOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#004b87] text-white hover:bg-[#004b87]/80 transition-colors"
            >
              Bulk Actions <ChevronDown size={16} />
            </button>
            
            {isBulkOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden">
                <button onClick={() => executeBulkAction('Email')} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-white/10"><Mail size={16}/> Send Email</button>
                <button onClick={() => executeBulkAction('WhatsApp')} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-white/10"><MessageCircle size={16}/> Send WhatsApp</button>
                <button onClick={() => executeBulkAction('Assign Seat')} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-white/10"><Armchair size={16}/> Assign Seats</button>
                <div className="h-px bg-white/10 my-1" />
                <button onClick={() => executeBulkAction('Delete')} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-red-400/10"><Trash size={16}/> Delete Selected</button>
              </div>
            )}
          </div>

          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <Download size={16} /> CSV
          </button>
          <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f26c22] hover:bg-[#f26c22]/90 text-white transition-colors">
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl border border-white/10 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/20 border-b border-white/10 text-gray-300">
            <tr>
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  className="rounded bg-black/20 border-white/20"
                  checked={selectedIds.size === filteredAttendees.length && filteredAttendees.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-4 font-medium">Attendee</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Reg ID / Category</th>
              <th className="p-4 font-medium">Payment</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredAttendees.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No attendees match your search.
                </td>
              </tr>
            ) : (
              filteredAttendees.map(attendee => (
                <tr key={attendee.id} className={`hover:bg-white/5 transition-colors ${selectedIds.has(attendee.id) ? 'bg-[#00aeef]/10' : ''}`}>
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      className="rounded bg-black/20 border-white/20"
                      checked={selectedIds.has(attendee.id)}
                      onChange={() => toggleSelect(attendee.id)}
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-white">{attendee.fullName}</p>
                    <p className="text-xs text-gray-400">{attendee.jobTitle || 'N/A'} @ {attendee.company || 'N/A'}</p>
                  </td>
                  <td className="p-4">
                    <p>{attendee.email}</p>
                    <p className="text-xs text-gray-400">{attendee.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-mono text-[#00aeef]">{attendee.registrationId}</p>
                    <p className="text-xs text-gray-400">{attendee.attendingAs}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      attendee.paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-400' : 
                      attendee.paymentStatus === 'WAIVED' ? 'bg-blue-500/20 text-blue-400' : 
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {attendee.paymentStatus || 'UNPAID'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      attendee.status === 'CHECKED_IN' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-300'
                    }`}>
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
