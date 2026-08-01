"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto refresh every 10 seconds for real-time feel
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return <main className="container text-center mt-20">Loading Dashboard...</main>;
  }

  const checkInPercentage = stats.totalRegistrants > 0 
    ? Math.round((stats.checkedInCount / stats.totalRegistrants) * 100) 
    : 0;

  return (
    <main className="container min-h-screen py-10">
      <h1 className="text-center mb-10">Real-time Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
        {/* Check-in Stats */}
        <div className="glass-card animate-fade-in text-center">
          <h3 className="mb-4 text-[rgba(255,255,255,0.7)]">Live Check-in Status</h3>
          <div className="flex items-end justify-center gap-2 mb-2">
            <span className="text-5xl font-bold" style={{ color: "var(--accent)" }}>{stats.checkedInCount}</span>
            <span className="text-xl text-[rgba(255,255,255,0.5)] mb-1">/ {stats.totalRegistrants}</span>
          </div>
          <p className="text-sm">Attendees Checked In ({checkInPercentage}%)</p>
          
          <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-2 mt-4 overflow-hidden">
            <div 
              className="bg-accent h-2 rounded-full" 
              style={{ width: `${checkInPercentage}%`, background: "var(--accent)", transition: "width 1s ease" }}
            ></div>
          </div>
        </div>

        {/* Prayer Requests */}
        <div className="glass-card animate-fade-in text-center" style={{ animationDelay: "0.1s" }}>
          <h3 className="mb-4 text-[rgba(255,255,255,0.7)]">Prayer Team Workload</h3>
          <div className="flex items-center justify-center mb-2">
            <span className="text-5xl font-bold" style={{ color: "var(--secondary)" }}>{stats.prayerRequests}</span>
          </div>
          <p className="text-sm">Total "Yes" for Prayer Request</p>
        </div>
      </div>

      {/* Business Stages Breakdown */}
      <div className="glass-card animate-fade-in max-w-4xl mx-auto" style={{ animationDelay: "0.2s" }}>
        <h3 className="mb-6 text-center text-[rgba(255,255,255,0.7)]">Business Stage Breakdown</h3>
        
        {stats.businessStages.length === 0 ? (
          <p className="text-center text-[rgba(255,255,255,0.5)]">No data yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {stats.businessStages.map((stageItem: any) => {
              const maxCount = Math.max(...stats.businessStages.map((s: any) => s.count));
              const barWidth = maxCount > 0 ? (stageItem.count / maxCount) * 100 : 0;
              
              return (
                <div key={stageItem.stage}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{stageItem.stage}</span>
                    <span className="font-bold">{stageItem.count}</span>
                  </div>
                  <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-4 rounded-full" 
                      style={{ 
                        width: `${barWidth}%`, 
                        background: "linear-gradient(90deg, var(--primary), var(--accent))",
                        transition: "width 1s ease"
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
