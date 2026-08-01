"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CheckinContent() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "staff123") {
      setIsAuthenticated(true);
      if (groupId) {
        fetchGroupData(groupId);
      }
    } else {
      setError("Invalid password");
    }
  };

  const fetchGroupData = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/group?groupId=${id}`);
      const data = await res.json();
      if (data.group) {
        setGroup(data.group);
      } else {
        setError(data.error || "Group not found");
      }
    } catch (err) {
      setError("Failed to fetch group");
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckIn = async (registrantId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrantId, checkedIn: !currentStatus }),
      });
      if (res.ok) {
        // Update local state
        setGroup((prev: any) => ({
          ...prev,
          registrants: prev.registrants.map((r: any) => 
            r.id === registrantId ? { ...r, checkedIn: !currentStatus } : r
          )
        }));
      }
    } catch (err) {
      alert("Failed to update check-in status");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="container flex items-center justify-center min-h-screen">
        <div className="glass-card animate-fade-in w-full max-w-sm text-center">
          <h2 className="mb-6 text-2xl">Staff Check-in</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter Staff Password" 
              className="input text-center" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
            <button type="submit" className="btn w-full">Unlock Portal</button>
          </form>
          <p className="mt-4 text-xs text-[rgba(255,255,255,0.5)]">Hint: password is staff123</p>
        </div>
      </main>
    );
  }

  if (loading) return <main className="container text-center mt-20">Loading...</main>;
  if (!group) return <main className="container text-center mt-20 text-red-400">{error}</main>;

  return (
    <main className="container min-h-screen py-10">
      <div className="glass-card animate-fade-in max-w-2xl mx-auto">
        <h1 className="text-center mb-2">{group.groupName}'s Group</h1>
        <p className="text-center mb-8 text-[rgba(255,255,255,0.7)]">Total Guests: {group.totalGuestCount}</p>
        
        <div className="flex-col gap-4">
          {group.registrants.map((registrant: any) => {
            const isIncomplete = registrant.role === "Primary" && !registrant.businessStage;
            
            return (
              <div 
                key={registrant.id} 
                className="flex items-center justify-between p-4 mb-4 rounded-xl"
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div>
                  <h3 className="mb-1" style={{ fontSize: "1.2rem", color: registrant.role === 'Primary' ? 'var(--accent)' : 'var(--foreground)' }}>
                    {registrant.name} <span className="text-xs ml-2 px-2 py-1 rounded bg-[rgba(255,255,255,0.1)]">{registrant.role}</span>
                  </h3>
                  
                  {isIncomplete ? (
                     <p className="text-sm" style={{ color: "var(--danger)" }}>
                       ⚠️ Incomplete Profile - Please fill out on-site tablet.
                     </p>
                  ) : (
                    <p className="text-sm text-[rgba(255,255,255,0.6)]">{registrant.email}</p>
                  )}
                </div>
                
                <button 
                  onClick={() => toggleCheckIn(registrant.id, registrant.checkedIn)}
                  className={`btn ${registrant.checkedIn ? '' : 'btn-secondary'}`}
                  style={{ 
                    background: registrant.checkedIn ? 'var(--success)' : 'transparent',
                    borderColor: registrant.checkedIn ? 'var(--success)' : 'var(--primary)',
                    color: registrant.checkedIn ? '#000' : 'var(--primary)'
                  }}
                >
                  {registrant.checkedIn ? "Checked In ✓" : "Check In"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default function CheckinPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <CheckinContent />
    </Suspense>
  );
}
