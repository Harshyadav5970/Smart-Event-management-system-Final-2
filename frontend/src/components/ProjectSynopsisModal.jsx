// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Project Synopsis & Viva Credentials Modal

import React from 'react';
import { X, Award, CheckCircle, GraduationCap, ShieldCheck, Database, QrCode, Cpu } from 'lucide-react';

export default function ProjectSynopsisModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/30 border border-brand-400/40 flex items-center justify-center text-brand-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight">EventHub — College Mini-Project</h3>
              <p className="text-xs text-brand-200">Department of Computer Science & Information Technology</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600">
          {/* Author & Guide Card */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Developer</p>
              <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">Harsh Yadav</h4>
              <p className="text-slate-600 font-medium">Roll No: 129 • Class: TYCS-B</p>
              <p className="text-[11px] text-brand-600 font-semibold mt-1">TYCS Final Year Mini-Project</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Department</p>
              <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">Computer Science</h4>
              <p className="text-slate-600 font-medium">B.Sc. Computer Science (TYCS)</p>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">Annual Tech Fest 2026</p>
            </div>
          </div>

          {/* Core Modules Breakdown */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3">Project Modules & Implementation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  1. Multi-Role RBAC System
                </span>
                <p className="text-[11px] text-slate-500">
                  JWT role authentication with protected API endpoints for Student, Club Organizer, and Admin.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <QrCode className="w-4 h-4 text-brand-600" />
                  2. QR Code Pass & Gate Scanner
                </span>
                <p className="text-[11px] text-slate-500">
                  Tamper-proof hash generation with <code>qrcode</code> and live webcam gate check-in via <code>html5-qrcode</code> with duplicate scan prevention.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <Award className="w-4 h-4 text-brand-600" />
                  3. Verified Certificate Generator
                </span>
                <p className="text-[11px] text-slate-500">
                  Automated vector PDF generation using <code>jspdf</code> including college header and guide signature block.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <Database className="w-4 h-4 text-brand-600" />
                  4. Resilient Dual-Engine DB
                </span>
                <p className="text-[11px] text-slate-500">
                  Connects to MongoDB Mongoose if active, or auto-switches to local JSON memory storage so the viva never crashes.
                </p>
              </div>
            </div>
          </div>

          {/* Pre-seeded Viva Demo Credentials */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950">
            <h5 className="font-bold text-xs uppercase tracking-wider mb-2">Pre-Configured Demo Accounts</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <div className="bg-white p-2 rounded-lg border border-amber-200">
                <p className="font-bold text-slate-800">Student:</p>
                <p className="text-slate-600">harsh@college.edu</p>
                <p className="text-slate-400">Pass: student123</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-amber-200">
                <p className="font-bold text-slate-800">Organizer:</p>
                <p className="text-slate-600">techclub@college.edu</p>
                <p className="text-slate-400">Pass: club123</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-amber-200">
                <p className="font-bold text-slate-800">Faculty Admin:</p>
                <p className="text-slate-600">admin@college.edu</p>
                <p className="text-slate-400">Pass: admin123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">EventHub • Academic Year 2025-2026</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
