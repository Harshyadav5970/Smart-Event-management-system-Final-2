// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Project Guide: Ms. Pranali Thakare
// Campus Announcement Feed Component

import React, { useState } from 'react';
import { Bell, AlertCircle, Plus, Trash2, Megaphone, Calendar } from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function AnnouncementFeed({ announcements, onRefresh }) {
  const { user, showToast } = useAuth();
  const isOrganizer = user && (user.role === 'organizer' || user.role === 'admin');

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    try {
      const res = await api.post('/announcements', { title, content, priority });
      if (res.success) {
        showToast('Notice published to campus feed!', 'success');
        setTitle('');
        setContent('');
        setShowForm(false);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      showToast('Failed to post announcement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      showToast('Announcement removed.', 'info');
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-coral-500/10 text-coral-600 flex items-center justify-center font-bold">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Campus Fest Notices & Updates
            </h3>
            <p className="text-xs text-slate-500">Live broadcasts from Organizing Committee</p>
          </div>
        </div>

        {isOrganizer && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Broadcast Update</span>
          </button>
        )}
      </div>

      {/* Broadcast Form */}
      {showForm && (
        <form onSubmit={handlePost} className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Notice Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Venue changed to Auditorium Hall 2 for Cultural Night"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Details & Instructions</label>
            <textarea
              rows={2}
              required
              placeholder="Provide exact timings, reporting venue, or requirements..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="font-bold text-slate-700">Priority:</label>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="normal"
                  checked={priority === 'normal'}
                  onChange={() => setPriority('normal')}
                />
                <span>Normal</span>
              </label>
              <label className="inline-flex items-center gap-1 cursor-pointer text-rose-600 font-bold">
                <input
                  type="radio"
                  name="priority"
                  value="urgent"
                  checked={priority === 'urgent'}
                  onChange={() => setPriority('urgent')}
                />
                <span>Urgent</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold"
              >
                {loading ? 'Posting...' : 'Post Notice'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No announcements posted yet.</p>
        ) : (
          announcements.map((item) => (
            <div
              key={item._id || item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.priority === 'urgent'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : 'bg-slate-50/70 border-slate-100 text-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {item.priority === 'urgent' && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white">
                      URGENT
                    </span>
                  )}
                  <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                </div>

                {isOrganizer && (
                  <button
                    onClick={() => handleDelete(item._id || item.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Delete notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.content}</p>

              <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Posted by: {item.authorName}</span>
                <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
