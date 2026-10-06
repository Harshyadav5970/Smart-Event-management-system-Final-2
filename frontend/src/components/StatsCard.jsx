// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Project Guide: Ms. Pranali Thakare
// Analytics KPI Card Component

import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'brand', trend }) {
  const colorMap = {
    brand: 'from-brand-500/10 to-indigo-500/5 text-brand-600 border-brand-200/60',
    emerald: 'from-emerald-500/10 to-teal-500/5 text-emerald-600 border-emerald-200/60',
    amber: 'from-amber-500/10 to-orange-500/5 text-amber-600 border-amber-200/60',
    rose: 'from-rose-500/10 to-pink-500/5 text-rose-600 border-rose-200/60'
  };

  return (
    <div className={`p-4 rounded-2xl bg-white border shadow-xs flex items-center justify-between ${colorMap[color] || colorMap.brand}`}>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        <h4 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
          {value}
        </h4>
        {subtitle && (
          <p className="text-[11px] text-slate-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center">
        {Icon && <Icon className="w-5 h-5" />}
      </div>
    </div>
  );
}
