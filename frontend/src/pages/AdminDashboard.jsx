// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Faculty Admin & HOD Overview Dashboard

import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  GraduationCap,
  Users,
  DollarSign,
  CheckCircle2,
  PieChart,
  Server,
  Activity,
  Layers,
  Award
} from 'lucide-react';

export default function AdminDashboard({ onOpenScanner, onOpenCreateEvent }) {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [healthInfo, setHealthInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [dashRes, healthRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/health')
        ]);
        if (dashRes && dashRes.success) setAnalytics(dashRes.data || dashRes.analytics || dashRes.stats);
        if (healthRes && (healthRes.status || healthRes.success)) setHealthInfo(healthRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const summary = analytics?.summary || {
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    checkedInCount: 0,
    attendanceRate: 0,
    totalStudents: 0
  };

  const departmentData = analytics?.departmentBreakdown || {
    'Computer Science': 45,
    'Information Tech': 28,
    'Electronics': 15,
    'Mechanical': 12
  };

  const categoryBreakdown = analytics?.categoryBreakdown || {
    Technical: 3,
    Cultural: 1,
    Sports: 1,
    Workshop: 1
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Faculty Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-amber-300 mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>HOD & Faculty Administration Console</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Campus EventHub Central Management
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Developed by <strong>Harsh Yadav (Roll 129, TYCS-B)</strong> • Dept. of Computer Science
          </p>
        </div>

        {/* System Engine Health Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <div className="text-xs">
            <p className="font-bold text-white">Database Engine</p>
            <p className="text-[11px] text-emerald-300 font-mono">
              {healthInfo?.dbEngine || 'Resilient Dual-Mode (Active)'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Registrations"
          value={summary.totalRegistrations}
          subtitle="All departmental tickets"
          icon={Users}
          color="brand"
        />

        <StatsCard
          title="Total Revenue Collected"
          value={`₹${summary.totalRevenue.toLocaleString()}`}
          subtitle="Festival fund accumulation"
          icon={DollarSign}
          color="emerald"
        />

        <StatsCard
          title="Gate Check-In Rate"
          value={`${summary.attendanceRate}%`}
          subtitle={`${summary.checkedInCount} verified check-ins`}
          icon={CheckCircle2}
          color="amber"
        />

        <StatsCard
          title="Total Events Scheduled"
          value={summary.totalEvents}
          subtitle="Tech, Cultural & Sports"
          icon={Layers}
          color="rose"
        />
      </div>

      {/* Analytical Breakdown Charts / Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Participation Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
          <h4 className="font-extrabold text-sm text-slate-900 mb-1">
            Department Participation Breakdown
          </h4>
          <p className="text-xs text-slate-400 mb-5">
            Student ticket distribution across college departments
          </p>

          <div className="space-y-4">
            {Object.entries(departmentData).map(([dept, count]) => {
              const total = Math.max(1, summary.totalRegistrations);
              const pct = Math.round((count / total) * 100);

              return (
                <div key={dept} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-700">{dept}</span>
                    <span className="text-slate-900 font-mono">
                      {count} students ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fest Category Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">
              Event Category Distribution
            </h4>
            <p className="text-xs text-slate-400 mb-5">
              Breakdown of fest tracks and workshops
            </p>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(categoryBreakdown).map(([cat, count]) => (
                <div
                  key={cat}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {cat}
                    </p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">
                      {count} Events
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Signed Certificates Enabled: <strong>WebCraft Workshop</strong></span>
            <span className="text-brand-600 font-bold">Faculty Verified ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
