"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, UserCheck, Activity, UsersRound } from "lucide-react";

type DashboardData = {
  totalRegistrations: number;
  todayRegistrations: number;
  checkedIn: number;
  attendanceRate: number;
  genderBreakdown: { name: string; value: number }[];
  occupationBreakdown: { name: string; value: number }[];
};

const COLORS = ["#f26c22", "#00aeef", "#004b87", "#34d399", "#8b5cf6"];

export default function DashboardClient({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Executive Dashboard</h2>
        <span className="text-sm text-gray-300">Live Updates</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-4 bg-[#f26c22]/20 rounded-xl text-[#f26c22]">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Registrations</p>
            <p className="text-3xl font-bold">{data.totalRegistrations}</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-4 bg-[#00aeef]/20 rounded-xl text-[#00aeef]">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Today's Registrations</p>
            <p className="text-3xl font-bold">{data.todayRegistrations}</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-4 bg-green-500/20 rounded-xl text-green-400">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Checked-In</p>
            <p className="text-3xl font-bold">{data.checkedIn}</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-4 bg-purple-500/20 rounded-xl text-purple-400">
            <UsersRound size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Attendance Rate</p>
            <p className="text-3xl font-bold">{data.attendanceRate}%</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-medium mb-6">Demographics (Gender)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.genderBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.genderBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: 'white' }}
                  itemStyle={{ color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-medium mb-6">Registrations by Occupation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.occupationBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                <Tooltip
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: 'white' }}
                />
                <Bar dataKey="value" fill="#00aeef" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
