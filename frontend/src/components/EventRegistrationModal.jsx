// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Event Registration Modal with Email & Password Authentication and Immediate Pass Generation

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Mail, Lock, User, CheckCircle2, QrCode, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import TicketCard from './TicketCard';

export default function EventRegistrationModal({ isOpen, onClose, event, onSuccess }) {
  const { user, showToast } = useAuth();
  const [loading, setLoading] = useState(false);
  const [createdPass, setCreatedPass] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || 'Harsh Yadav',
    email: user?.email || 'harsh@college.edu',
    password: '',
    rollNo: user?.rollNo || '129',
    department: user?.department || 'Computer Science'
  });

  useEffect(() => {
    if (isOpen) {
      setCreatedPass(null);
      setFormData({
        name: user?.name || 'Harsh Yadav',
        email: user?.email || 'harsh@college.edu',
        password: '',
        rollNo: user?.rollNo || '129',
        department: user?.department || 'Computer Science'
      });
    }
  }, [isOpen, user]);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      showToast('Please enter a valid college email.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/tickets/register', {
        eventId: event._id || event.id,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        rollNo: formData.rollNo,
        department: formData.department
      });

      if (res.success && res.data) {
        setCreatedPass(res.data);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast(res.message || 'Pass successfully generated!', 'success');
        if (onSuccess) onSuccess(res.data);
      } else {
        showToast(res.message || 'Registration failed.', 'error');
      }
    } catch (err) {
      showToast('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/30 border border-brand-400/40 flex items-center justify-center text-brand-300 font-bold">
              🎟️
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">Event Registration</h3>
              <p className="text-[10px] text-slate-400">Email & Password Verified Pass</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* If Pass was successfully created, show it immediately! */}
          {createdPass ? (
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs">Pass Generated Successfully!</h4>
                  <p className="text-[11px] text-emerald-800">
                    Registered to <strong>{createdPass.studentEmail}</strong>. Present this QR code at the gate.
                  </p>
                </div>
              </div>

              {/* Render the Ticket Card */}
              <TicketCard ticket={createdPass} event={event} />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCreatedPass(null);
                    setFormData((prev) => ({ ...prev, email: '', password: '', name: '' }));
                  }}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors cursor-pointer text-center"
                >
                  + Register Another Email
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors cursor-pointer text-center"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Event Summary Pill */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-100 text-brand-700">
                    {event.category}
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {event.fee === 0 ? 'FREE PASS' : `₹${event.fee}`}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mt-1.5">{event.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{event.date} • {event.venue}</p>
              </div>

              {/* Single Pass Policy Notice */}
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-amber-900 text-[11px] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>1 pass per email id</strong> for this event. You can register multiple times using different emails.
                </span>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Attendee Name *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Harsh Yadav"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">College Email *</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. harsh@college.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Account Password / Security PIN</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Enter password (e.g. student123)"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Used to verify your existing account or create a new student login.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Roll Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 129"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Department</label>
                    <input
                      type="text"
                      placeholder="Computer Science"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl font-bold shadow-sm transition-all hover:shadow cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{loading ? 'Generating Pass...' : 'Confirm Registration & Generate Pass'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
