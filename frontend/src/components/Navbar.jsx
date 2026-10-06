// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Top Navbar with Viva Fast Role Switcher & Student Profile

import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Sparkles,
  HelpCircle,
  LogOut,
  User,
  Shield,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function Navbar({ searchQuery, setSearchQuery, onOpenSynopsis }) {
  const { user, logout, demoLogin, toast } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center justify-between">
      {/* Toast Notification Banner (Floating top right) */}
      {toast && (
        <div
          className={`fixed top-4 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold backdrop-blur-lg animate-in slide-in-from-top-4 duration-200 ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white shadow-rose-500/20'
              : toast.type === 'warning'
              ? 'bg-amber-500 text-white shadow-amber-500/20'
              : 'bg-slate-900 text-white shadow-slate-900/20'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="relative w-80 max-w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Hackathon, RoboWars, venues..."
          className="w-full pl-9 pr-4 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs rounded-xl border border-transparent focus:border-brand-500/30 focus:outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Center/Right: Examiner Quick-Switch & Profile */}
      <div className="flex items-center gap-3">
        {/* Viva Quick Role Switcher Bar */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
            Viva Switch:
          </span>
          <button
            onClick={() => demoLogin('student')}
            title="Fast switch to Student (Harsh Yadav)"
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              user?.role === 'student'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎓 Student
          </button>
          <button
            onClick={() => demoLogin('organizer')}
            title="Fast switch to Club Organizer"
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              user?.role === 'organizer'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Organizer
          </button>
          <button
            onClick={() => demoLogin('admin')}
            title="Fast switch to Faculty Admin"
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              user?.role === 'admin'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛡️ Admin
          </button>
        </div>

        {/* Academic Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50/80 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 font-semibold">
          <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
          <span>College Fest Portal 2026</span>
        </div>

        {/* Help / Project Info button */}
        <button
          onClick={onOpenSynopsis}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Project Synopsis & Credentials"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Chip */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-coral-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user.name ? user.name.substring(0, 2).toUpperCase() : 'HY'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">
                {user.name}
              </p>
              <p className="text-[10px] text-brand-600 font-semibold mt-0.5 capitalize">
                {user.role} {user.rollNo ? `• ${user.rollNo}` : ''}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 ml-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
