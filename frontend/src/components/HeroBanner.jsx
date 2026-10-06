// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Minimalist, Clean & Presentable Hero Banner

import React from 'react';
import { ArrowRight, QrCode, Calendar, Sparkles } from 'lucide-react';

export default function HeroBanner({
  onExploreClick,
  onOpenScanner,
  onSelectEvent,
  featuredEvents = [],
  user
}) {
  const isOrganizer = user && (user.role === 'organizer' || user.role === 'admin');

  return (
    <div className="relative overflow-hidden pt-8 pb-10 px-6 rounded-3xl mb-8 bg-gradient-to-b from-white/60 to-white/95 border border-white/80 shadow-soft">
      {/* Organic Curved Gradient Background Elements */}
      <div className="mesh-gradient-bg">
        <div className="mesh-shape-1"></div>
        <div className="mesh-shape-2"></div>
        <div className="mesh-shape-3"></div>
      </div>

      {/* Floating Sparkle Pill */}
      <div className="relative z-10 flex justify-center mb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs text-xs font-bold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>College Fest 2026</span>
          <span className="text-slate-300">•</span>
          <span className="text-brand-600 font-extrabold">TYCS-B</span>
        </div>
      </div>

      {/* Main Title Typography - Concise & Clean */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-5">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          College Fest,{' '}
          <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-coral-500 bg-clip-text text-transparent">
            Reimagined
          </span>
        </h2>
        <p className="mt-2 text-xs md:text-sm text-slate-500 font-medium">
          Digital QR entry passes, gate scanning, and verified participation certificates.
        </p>
      </div>

      {/* Center Floating Prompt Card */}
      <div className="relative z-10 max-w-xl mx-auto bg-white/95 backdrop-blur-xl border border-white p-4 sm:p-5 rounded-2xl shadow-xl shadow-slate-900/5 mb-7">
        <p className="text-xs text-slate-600 text-center font-medium">
          Select an event to register with your email and get an instant digital pass.
        </p>

        <div className="mt-3.5 flex items-center justify-center gap-2.5">
          <button
            onClick={onExploreClick}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold shadow-md shadow-slate-900/15 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Browse Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {isOrganizer && (
            <button
              onClick={onOpenScanner}
              className="px-5 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200/80 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Gate Scanner</span>
            </button>
          )}
        </div>
      </div>

      {/* Row of 3 Clean Floating Preview Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-4xl mx-auto">
        {featuredEvents.slice(0, 3).map((event) => (
          <div
            key={event._id || event.id}
            onClick={() => onSelectEvent(event)}
            className="glass-card-subtle p-3.5 rounded-2xl hover:bg-white/95 transition-all duration-200 border border-white/80 shadow-xs hover:shadow-md flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-100 text-brand-700">
                  {event.category}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {event.fee === 0 ? 'Free' : `₹${event.fee}`}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                {event.title}
              </h4>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium flex items-center gap-1 text-[10px]">
                <Calendar className="w-3 h-3 text-slate-400" />
                {event.date}
              </span>
              <span className="text-brand-600 font-bold group-hover:translate-x-0.5 transition-transform text-xs">
                Get Pass &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
