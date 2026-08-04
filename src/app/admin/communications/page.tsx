"use client";

import React, { useState } from 'react';
import { Mail, MessageCircle, Send } from 'lucide-react';

export default function CommunicationsPage() {
  const [channel, setChannel] = useState<'email' | 'whatsapp'>('email');
  const [audience, setAudience] = useState('ALL');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/communications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, audience, subject, message })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(`Successfully queued ${data.count} messages via ${channel.toUpperCase()}`);
        setSubject('');
        setMessage('');
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus('Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Communication Center</h2>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setChannel('email')}
            className={`flex-1 p-4 rounded-xl border flex items-center justify-center gap-3 transition-colors ${
              channel === 'email' ? 'bg-[#004b87] border-[#00aeef] text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Mail size={24} />
            <span className="font-semibold">Email Broadcast</span>
          </button>
          <button 
            onClick={() => setChannel('whatsapp')}
            className={`flex-1 p-4 rounded-xl border flex items-center justify-center gap-3 transition-colors ${
              channel === 'whatsapp' ? 'bg-green-600 border-green-400 text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <MessageCircle size={24} />
            <span className="font-semibold">WhatsApp Broadcast</span>
          </button>
        </div>

        <form onSubmit={handleSend} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Target Audience</label>
            <select 
              value={audience} 
              onChange={(e) => setAudience(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:border-[#00aeef]"
            >
              <option value="ALL">All Registered Attendees</option>
              <option value="CHECKED_IN">Checked-in Attendees Only</option>
              <option value="PENDING">Pending (Not checked-in) Attendees</option>
              <option value="UNPAID">Unpaid Attendees</option>
            </select>
          </div>

          {channel === 'email' && (
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Email Subject</label>
              <input 
                type="text" 
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Important update about Inspire 2026..."
                className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:border-[#00aeef]"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Message Body</label>
            <textarea 
              required
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={channel === 'whatsapp' ? "Enter your WhatsApp text message here..." : "Enter your email HTML or text content here..."}
              className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:border-[#00aeef] resize-y"
            ></textarea>
            {channel === 'whatsapp' && (
              <p className="text-xs text-yellow-500">Note: Sending free-form WhatsApp text requires the user to have messaged you within the last 24 hours, OR you must use a pre-approved Template.</p>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <div className={`text-sm ${status?.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {status}
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 bg-[#f26c22] text-white rounded-lg font-bold hover:bg-[#f26c22]/90 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Sending...' : (
                <>
                  <Send size={18} /> Send Broadcast
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
