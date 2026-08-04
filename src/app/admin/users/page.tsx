"use client";

import React, { useState } from 'react';
import { Shield, Plus, UserCheck, Search, Edit2, Trash2 } from 'lucide-react';

export default function UsersVolunteersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'volunteers'>('users');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - In reality, fetch from API
  const [users] = useState([
    { id: '1', name: 'Super Admin', email: 'admin@inspiresummit.com', role: 'SUPER_ADMIN' },
    { id: '2', name: 'Event Coordinator', email: 'events@inspiresummit.com', role: 'EVENT_ADMIN' },
    { id: '3', name: 'Registration Desk 1', email: 'reg1@inspiresummit.com', role: 'REGISTRATION_OFFICER' },
  ]);

  const [volunteers] = useState([
    { id: '1', name: 'Sarah Connor', phone: '+1234567890', role: 'Usher', status: 'ACTIVE' },
    { id: '2', name: 'James Smith', phone: '+0987654321', role: 'Check-in Assistant', status: 'ACTIVE' },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#f26c22] rounded-lg font-medium hover:bg-[#f26c22]/90 transition-colors">
          <Plus size={18} /> Add {activeTab === 'users' ? 'Admin' : 'Volunteer'}
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors ${
              activeTab === 'users' ? 'text-[#00aeef] border-b-2 border-[#00aeef] bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield size={18} /> Admin Users
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors ${
              activeTab === 'volunteers' ? 'text-[#f26c22] border-b-2 border-[#f26c22] bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck size={18} /> Event Volunteers
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#00aeef]"
            />
          </div>
        </div>

        {/* Tables */}
        <div className="overflow-x-auto">
          {activeTab === 'users' ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-gray-300">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Access Role</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{user.name}</td>
                    <td className="p-4 text-gray-300">{user.email}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-[#004b87]/50 text-[#00aeef] rounded-md text-xs font-mono border border-[#00aeef]/20">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button className="p-2 bg-black/20 text-gray-300 hover:text-white rounded-lg transition-colors border border-white/10">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-gray-300">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Assigned Duty</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {volunteers.map(vol => (
                  <tr key={vol.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{vol.name}</td>
                    <td className="p-4 text-gray-300">{vol.phone}</td>
                    <td className="p-4 text-gray-300">{vol.role}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs font-medium border border-green-500/20">
                        {vol.status}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button className="p-2 bg-black/20 text-gray-300 hover:text-white rounded-lg transition-colors border border-white/10">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
