"use client";

import React, { useState } from 'react';
import { Armchair, Plus, Trash2, Edit2 } from 'lucide-react';

export default function SeatingPage() {
  const [sections] = useState([
    { id: '1', name: 'VIP Front Row', capacity: 50, occupied: 12, priceTier: 'Premium' },
    { id: '2', name: 'General Admission - Block A', capacity: 200, occupied: 150, priceTier: 'Standard' },
    { id: '3', name: 'General Admission - Block B', capacity: 200, occupied: 45, priceTier: 'Standard' },
    { id: '4', name: 'Speakers & Guests', capacity: 30, occupied: 30, priceTier: 'Reserved' },
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Seat & Section Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#f26c22] rounded-lg font-medium hover:bg-[#f26c22]/90 transition-colors">
          <Plus size={18} /> Add Section
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sections Overview */}
        <div className="lg:col-span-2 space-y-4">
          {sections.map(section => (
            <div key={section.id} className="glass-card p-6 rounded-2xl border border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Armchair size={18} className="text-[#00aeef]" /> {section.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">Tier: {section.priceTier}</p>
                
                <div className="mt-4 flex items-center gap-4">
                  <div className="w-48 bg-black/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-[#00aeef] h-full" 
                      style={{ width: \`\${(section.occupied / section.capacity) * 100}%\` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    {section.occupied} / {section.capacity} Seats
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="p-2 bg-black/20 text-gray-300 hover:text-white rounded-lg transition-colors border border-white/10 hover:border-white/20">
                  <Edit2 size={16} />
                </button>
                <button className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 bg-[#004b87] rounded-full flex items-center justify-center mx-auto mb-4">
              <Armchair size={32} className="text-[#00aeef]" />
            </div>
            <h3 className="font-bold text-lg">Auto-Assign Seats</h3>
            <p className="text-sm text-gray-400">
              Automatically assign seats to all registered attendees based on their ticket tier and registration date.
            </p>
            <button className="w-full py-3 bg-[#004b87] hover:bg-[#004b87]/80 rounded-xl font-bold transition-colors">
              Run Auto-Assign
            </button>
          </div>
          
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
             <h3 className="font-bold text-lg border-b border-white/10 pb-2">Seat Assignment Rules</h3>
             <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4">
               <li>VIPs get priority in Front Row.</li>
               <li>Groups are kept together if registered under same organization.</li>
               <li>Unpaid tickets do not receive seat assignments.</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
