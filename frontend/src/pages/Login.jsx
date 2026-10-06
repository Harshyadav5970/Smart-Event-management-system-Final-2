// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Project Guide: Ms. Pranali Thakare
// Login Page with 1-Click Viva Demo Role Fast-Login

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, GraduationCap, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login({ onSwitchToRegister }) {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background organic gradients */}
      <div className="mesh-gradient-bg">
        <div className="mesh-shape-1"></div>
        <div className="mesh-shape-2"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Branding header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-coral-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 mx-auto font-black text-2xl mb-3">
            ⚡
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Event<span className="text-brand-600">Hub</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Smart College Event & Fest Management System
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-slate-200/80 text-[11px] font-bold text-slate-700 shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
            <span>Harsh Yadav (Roll 129, TYCS-B)</span>
          </div>
        </div>

        {/* 1-Click Viva Demo Switcher (Featured prominently for professors and evaluation) */}
        <div className="mb-6 p-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-white shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              1-Click Viva Evaluation Demo
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
              Instant Access
            </span>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => demoLogin('student')}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-brand-700">
                  🎓 Harsh Yadav (Student)
                </p>
                <p className="text-[10px] text-slate-500">harsh@college.edu • Pre-registered passes</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => demoLogin('organizer')}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                  ⚡ Tech Council (Club Organizer)
                </p>
                <p className="text-[10px] text-slate-500">techclub@college.edu • Gate scanner & stats</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => demoLogin('admin')}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                  🛡️ Faculty Administration (HOD)
                </p>
                <p className="text-[10px] text-slate-500">admin@college.edu • Overall fest control</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Standard Manual Login Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <h3 className="font-bold text-sm text-slate-900 mb-4">Or sign in manually</h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">College Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. harsh@college.edu"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl font-bold shadow-sm transition-all hover:shadow cursor-pointer mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-brand-600 hover:text-brand-700 font-bold text-xs cursor-pointer"
            >
              New student or organizer? Register here &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
