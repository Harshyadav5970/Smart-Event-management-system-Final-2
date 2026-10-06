// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Event Card Component with Capacity Indicator & Registration Trigger

import React from 'react';
import { Calendar, MapPin, Users, CheckCircle, Tag, Clock } from 'lucide-react';

export default function EventCard({
  event,
  isRegistered,
  onRegister,
  onViewPass,
  onMarkCompleted,
  user
}) {
  const isOrganizerOrAdmin = user && (user.role === 'organizer' || user.role === 'admin');
  const percentFilled = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.maxSeats || 100)) * 100)
  );

  const isFull = (event.registeredCount || 0) >= (event.maxSeats || 100);
  const isCompleted = event.status === 'Completed';

  // Category specific accent colors
  const categoryColors = {
    Technical: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Cultural: 'bg-pink-50 text-pink-700 border-pink-200',
    Sports: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Workshop: 'bg-amber-50 text-amber-800 border-amber-200'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Banner with overlaid pills */}
        <div className="relative h-40 w-full overflow-hidden bg-slate-100">
          <img
            src={event.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

          {/* Top category & fee pills */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-xs ${categoryColors[event.category] || categoryColors.Technical}`}>
              {event.category}
            </span>
            <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-slate-900/90 text-white backdrop-blur-md shadow-xs">
              {event.fee === 0 ? 'FREE ENTRY' : `₹${event.fee}`}
            </span>
          </div>

          {/* Status pill on bottom banner */}
          <div className="absolute bottom-2.5 left-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isCompleted
                ? 'bg-emerald-500/90 text-white'
                : 'bg-white/90 text-slate-800'
            }`}>
              {event.status}
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600 mb-1">
            {event.clubName || 'Student Activity Cell'}
          </p>
          <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1 group-hover:text-brand-600 transition-colors">
            {event.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Info meta items */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{event.date} • {event.time || '10:00 AM'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                Capacity
              </span>
              <span className="font-bold text-slate-700">
                {event.registeredCount || 0} / {event.maxSeats || 100} ({percentFilled}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  percentFilled > 85 ? 'bg-rose-500' : 'bg-brand-500'
                }`}
                style={{ width: `${percentFilled}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        {isCompleted ? (
          <div className="w-full py-2 px-3 bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold text-center">
            Event Concluded
          </div>
        ) : isFull ? (
          <div className="w-full py-2 px-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold text-center">
            Registrations Full
          </div>
        ) : isRegistered ? (
          <div className="space-y-1.5">
            <button
              onClick={() => onViewPass(event)}
              className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pass Confirmed (View Ticket)</span>
            </button>
            <button
              onClick={() => onRegister(event)}
              className="w-full py-1 text-[11px] text-slate-500 hover:text-brand-600 font-bold transition-colors text-center cursor-pointer block"
            >
              + Register another email for this event
            </button>
          </div>
        ) : (
          <button
            onClick={() => onRegister(event)}
            className="w-full py-2.5 px-3 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Register & Get Pass</span>
          </button>
        )}

        {/* Organizer quick toggle to mark completed (Unlocks certificates viva demo!) */}
        {isOrganizerOrAdmin && !isCompleted && (
          <button
            onClick={() => onMarkCompleted(event)}
            className="w-full mt-2 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            title="Mark this event as Completed to enable Certificate Downloads"
          >
            Mark Concluded (Enable Certificates)
          </button>
        )}
      </div>
    </div>
  );
}
