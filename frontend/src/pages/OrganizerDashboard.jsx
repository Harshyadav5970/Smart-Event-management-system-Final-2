// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Project Guide: Ms. Pranali Thakare
// Organizer & Club Lead Dashboard (Analytics, Scanner & Event Controls)

import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  DollarSign,
  CheckCircle2,
  Calendar,
  QrCode,
  Plus,
  RefreshCw,
  Eye,
  Trash2,
  Award,
  Layers
} from 'lucide-react';

export default function OrganizerDashboard({
  onOpenScanner,
  onOpenCreateEvent
}) {
  const { user, showToast } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState(null); // { eventTitle, attendees: [] }
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/dashboard');
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to load organizer analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  // Mark event completed to enable student certificates
  const handleToggleStatus = async (eventId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Upcoming' : 'Completed';
    const res = await api.put(`/events/${eventId}`, { status: newStatus });
    if (res.success) {
      showToast(`Event marked as ${newStatus}!`, 'success');
      fetchAnalytics();
    } else {
      showToast(res.message || 'Status update failed', 'error');
    }
  };

  // View attendee list
  const handleViewAttendees = async (event) => {
    try {
      const res = await api.get(`/tickets/event/${event.id}`);
      if (res.success) {
        setSelectedEventAttendees({
          eventTitle: event.title,
          attendees: res.data || []
        });
      }
    } catch (err) {
      showToast('Could not load attendees', 'error');
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to remove this event?')) return;
    const res = await api.delete(`/events/${eventId}`);
    if (res.success) {
      showToast('Event removed.', 'info');
      fetchAnalytics();
    }
  };

  const summary = analytics?.summary || {
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    checkedInCount: 0,
    attendanceRate: 0
  };

  const eventStats = analytics?.eventStats || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Fast Actions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider mb-2">
            Organizing Council Hub
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Fest Analytics & Operations Command
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong>{user?.name}</strong> • Live attendance and gate check-in monitors
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenScanner}
            className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Gate Scanner</span>
          </button>

          <button
            onClick={onOpenCreateEvent}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Registrations"
          value={summary.totalRegistrations}
          subtitle="Confirmed student passes"
          icon={Users}
          color="brand"
        />

        <StatsCard
          title="Fest Revenue"
          value={`₹${summary.totalRevenue.toLocaleString()}`}
          subtitle="Collected entry fees"
          icon={DollarSign}
          color="emerald"
        />

        <StatsCard
          title="Gate Attendance Rate"
          value={`${summary.attendanceRate}%`}
          subtitle={`${summary.checkedInCount} of ${summary.totalRegistrations} checked-in`}
          icon={CheckCircle2}
          color="amber"
        />

        <StatsCard
          title="Hosted Events"
          value={summary.totalEvents}
          subtitle="Technical, Cultural, Sports"
          icon={Calendar}
          color="rose"
        />
      </div>

      {/* Events Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">College Events Roster</h3>
            <p className="text-xs text-slate-400">Track check-ins, revenue collection, and certificate status</p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-3 px-6">Event Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date & Venue</th>
                <th className="py-3 px-4">Registrations</th>
                <th className="py-3 px-4">Gate Check-Ins</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {eventStats.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900 line-clamp-1">{e.title}</p>
                    <p className="text-[10px] text-slate-400">Fee: {e.fee === 0 ? 'FREE' : `₹${e.fee}`}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <p>{e.date}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{e.venue}</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {e.registrations} students
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-600">{e.checkIns}</span>
                    <span className="text-slate-400 text-[10px] ml-1">
                      ({e.registrations > 0 ? Math.round((e.checkIns / e.registrations) * 100) : 0}%)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    ₹{e.revenue}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      e.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleViewAttendees(e)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                        title="View registered attendees"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(e.id, e.status)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                          e.status === 'Completed'
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Toggle Completed to unlock student certificates"
                      >
                        {e.status === 'Completed' ? 'Reopen' : 'Conclude'}
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(e.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Cancel event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendee Inspection Modal */}
      {selectedEventAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  Attendees for: {selectedEventAttendees.eventTitle}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {selectedEventAttendees.attendees.length} total registrations recorded
                </p>
              </div>
              <button
                onClick={() => setSelectedEventAttendees(null)}
                className="text-slate-400 hover:text-slate-800 text-sm font-bold"
              >
                &times;
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 text-xs flex-1">
              {selectedEventAttendees.attendees.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No attendees registered yet.</p>
              ) : (
                selectedEventAttendees.attendees.map((a) => (
                  <div
                    key={a._id || a.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{a.studentName}</p>
                      <p className="text-[10px] text-slate-500">
                        Roll: {a.studentRoll || '129'} • {a.studentDept || 'Computer Science'} • Ticket: <code>{a.ticketId}</code>
                      </p>
                    </div>

                    <div>
                      {a.checkInStatus ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓ Checked In
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Pending Gate
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right mt-4">
              <button
                onClick={() => setSelectedEventAttendees(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
