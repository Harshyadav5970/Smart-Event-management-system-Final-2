// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Left Sidebar matching the modern Codeflying aesthetic

import React from 'react';
import {
  Compass,
  Ticket,
  Bell,
  BarChart3,
  QrCode,
  Plus,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  CalendarDays,
  Award
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  onOpenCreateEvent,
  onOpenScanner,
  onOpenSynopsis
}) {
  const isOrganizerOrAdmin = user && (user.role === 'organizer' || user.role === 'admin');

  const navItems = [
    {
      id: 'browse',
      label: 'Browse Events',
      icon: Compass,
      roles: ['student', 'organizer', 'admin'],
      badge: 'Live'
    },
    {
      id: 'tickets',
      label: 'My Passes',
      icon: Ticket,
      roles: ['student', 'organizer', 'admin']
    },
    {
      id: 'scanner',
      label: 'Gate Scanner',
      icon: QrCode,
      roles: ['organizer', 'admin'],
      badge: 'Webcam'
    },
    {
      id: 'analytics',
      label: 'Fest Analytics',
      icon: BarChart3,
      roles: ['organizer', 'admin']
    },
    {
      id: 'announcements',
      label: 'Campus Notices',
      icon: Bell,
      roles: ['student', 'organizer', 'admin']
    }
  ];

  return (
    <aside className="w-64 bg-white/90 backdrop-blur-xl border-r border-slate-100 flex flex-col justify-between p-4 min-h-screen shrink-0 z-20">
      <div>
        {/* Brand Logo matching Codeflying style */}
        <div className="flex items-center gap-2.5 px-2 py-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-coral-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 font-extrabold text-lg">
            ⚡
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
              EVENT<span className="text-brand-600">HUB</span>
            </h1>
            <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
              Smart Fest System
            </p>
          </div>
        </div>

        {/* Primary CTA Button matching the image box (+ Create New App style) */}
        {isOrganizerOrAdmin ? (
          <button
            onClick={onOpenCreateEvent}
            className="w-full mb-6 p-3 rounded-2xl border-2 border-slate-900/10 hover:border-brand-500/40 bg-gradient-to-b from-white to-slate-50/80 hover:to-brand-50/40 shadow-sm transition-all duration-200 flex flex-col items-center justify-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 group-hover:bg-brand-600 flex items-center justify-center text-white transition-colors duration-200 shadow-sm">
              <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight">
              Create New Event
            </span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('browse')}
            className="w-full mb-6 p-3 rounded-2xl border border-slate-200/80 bg-white hover:border-brand-300 shadow-sm transition-all duration-200 flex flex-col items-center justify-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight">
              Explore Fest Events
            </span>
          </button>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems
            .filter((item) => !user || item.roles.includes(user.role))
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'scanner') {
                      onOpenScanner();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-brand-50/90 text-brand-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-brand-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded-md font-bold uppercase tracking-wider ${
                        item.badge === 'Webcam'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-brand-100 text-brand-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>
      </div>

      {/* Bottom Membership-Style Card (Exact replica of Codeflying bottom gradient box) */}
      <div className="pt-4 border-t border-slate-100/80">
        <div className="rounded-2xl p-3.5 bg-gradient-to-br from-coral-500 via-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/15 relative overflow-hidden">
          {/* Subtle crown / graduation cap watermark */}
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md rounded-full text-white">
              TYCS-B • Roll 129
            </span>
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
          </div>

          <h4 className="text-xs font-extrabold tracking-tight">Harsh Yadav</h4>
          <p className="text-[10px] text-white/80 leading-snug mt-0.5">
            Dept. of Computer Science
          </p>

          <button
            onClick={onOpenSynopsis}
            className="mt-2.5 w-full py-1.5 px-2 bg-white hover:bg-slate-50 text-slate-900 rounded-xl text-[11px] font-bold shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Project Details</span>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between px-1 text-[10px] text-slate-400 font-medium">
          <span>EventHub v1.0</span>
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Server Ready
          </span>
        </div>
      </div>
    </aside>
  );
}
