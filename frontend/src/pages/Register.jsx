// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Project Guide: Ms. Pranali Thakare
// Registration / Signup Page

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, GraduationCap, Lock, Mail, User, Phone, ArrowLeft } from 'lucide-react';

export default function Register({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    rollNo: '129',
    department: 'Computer Science',
    year: 'TYCS-B',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await register(formData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="mesh-gradient-bg">
        <div className="mesh-shape-1"></div>
        <div className="mesh-shape-2"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-coral-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 mx-auto font-black text-2xl mb-3">
            ⚡
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Join EventHub College Fest Portal 2026
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Harsh Yadav"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">College Email</label>
              <input
                type="email"
                required
                placeholder="e.g. harsh@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium bg-white"
                >
                  <option value="student">Student</option>
                  <option value="organizer">Club Organizer</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Roll No / ID</label>
                <input
                  type="text"
                  placeholder="e.g. 129"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium bg-white"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Tech">Information Tech</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Class / Year</label>
                <input
                  type="text"
                  placeholder="e.g. TYCS-B"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl font-bold shadow-sm transition-all hover:shadow cursor-pointer mt-2"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-brand-600 hover:text-brand-700 font-bold text-xs flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Already registered? Sign in</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
