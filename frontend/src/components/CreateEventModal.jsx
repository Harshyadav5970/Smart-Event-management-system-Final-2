// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Project Guide: Ms. Pranali Thakare
// Create Event Modal for Organizers & Admin

import React, { useState } from 'react';
import { X, Sparkles, Calendar, MapPin, DollarSign, Users, Layers, Image as ImageIcon } from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function CreateEventModal({ isOpen, onClose, onEventCreated }) {
  const { showToast } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    venue: '',
    fee: 0,
    maxSeats: 120,
    clubName: 'Tech Council & Student Cell',
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
  });

  const bannerPresets = [
    { label: 'Hackathon/Code', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80' },
    { label: 'RoboWars/Hardware', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80' },
    { label: 'Cultural/Music', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80' },
    { label: 'Sports', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80' }
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.venue) {
      showToast('Please fill in title, description, and venue.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/events', formData);
      if (res.success) {
        showToast('Event created and published successfully!', 'success');
        if (onEventCreated) onEventCreated(res.data);
        onClose();
      } else {
        showToast(res.message || 'Failed to create event', 'error');
      }
    } catch (err) {
      showToast('Error communicating with server', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h3 className="font-extrabold text-sm">Create New College Event</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. AI-Ignite National Hackathon 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium bg-white"
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Organizing Club / Cell</label>
              <input
                type="text"
                value={formData.clubName}
                onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                placeholder="e.g. CSI Student Branch"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Event rules, rounds, eligibility, and prizes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Time</label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Venue *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lab 401 & 402"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Max Seats (Capacity)</label>
              <input
                type="number"
                min={1}
                value={formData.maxSeats}
                onChange={(e) => setFormData({ ...formData, maxSeats: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Registration Fee (₹ 0 for Free)</label>
            <input
              type="number"
              min={0}
              value={formData.fee}
              onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          {/* Banner Preset Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Banner Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {bannerPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setFormData({ ...formData, banner: preset.url })}
                  className={`p-1.5 rounded-lg border text-[11px] font-semibold text-left flex items-center gap-1.5 cursor-pointer ${
                    formData.banner === preset.url
                      ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ImageIcon className="w-3 h-3 text-slate-400" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold shadow-sm transition-colors cursor-pointer"
            >
              {loading ? 'Publishing...' : 'Publish College Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
