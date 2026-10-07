// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Student Main Dashboard (Events Discovery & My Passes)

import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import EventCard from '../components/EventCard';
import TicketCard from '../components/TicketCard';
import AnnouncementFeed from '../components/AnnouncementFeed';
import EventRegistrationModal from '../components/EventRegistrationModal';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Compass, Ticket, Bell, Sparkles, Filter, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentDashboard({
  activeTab,
  setActiveTab,
  searchQuery,
  onOpenScanner,
  onOpenCreateEvent,
  onOpenSynopsis
}) {
  const { user, showToast } = useAuth();
  const [events, setEvents] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [feeType, setFeeType] = useState('all'); // 'all', 'free', 'paid'
  const [loading, setLoading] = useState(true);
  const [registeringEvent, setRegisteringEvent] = useState(null);

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop'];

  // Load campus data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, ticketsRes, annRes] = await Promise.all([
        api.get('/events'),
        api.get('/tickets/my-tickets'),
        api.get('/announcements')
      ]);

      if (eventsRes && eventsRes.success) setEvents(eventsRes.data || eventsRes.events || []);
      if (ticketsRes && ticketsRes.success) setMyTickets(ticketsRes.data || ticketsRes.tickets || []);
      if (annRes && annRes.success) setAnnouncements(annRes.data || annRes.announcements || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Open email/password registration modal
  const handleOpenRegisterModal = (event) => {
    setRegisteringEvent(event);
  };

  // Organizer quick toggle to conclude event and enable certificates
  const handleMarkCompleted = async (event) => {
    const res = await api.put(`/events/${event._id || event.id}`, { status: 'Completed' });
    if (res.success) {
      showToast(`Event marked as Completed! Certificates now enabled.`, 'success');
      fetchData();
    } else {
      showToast(res.message || 'Update failed', 'error');
    }
  };

  // Check if student is registered for a specific event
  const isUserRegistered = (eventId) => {
    return myTickets.some(t => t.eventId === eventId);
  };

  // Filter events by search, category, and fee
  const filteredEvents = (events || []).filter(e => {
    if (!e) return false;
    // Category
    if (selectedCategory !== 'All' && e.category && e.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // Fee type
    const feeNum = Number(e.fee) || 0;
    if (feeType === 'free' && feeNum > 0) return false;
    if (feeType === 'paid' && feeNum === 0) return false;
    // Search
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (e.title || '').toLowerCase().includes(q);
      const matchVenue = (e.venue || '').toLowerCase().includes(q);
      const matchClub = (e.clubName || '').toLowerCase().includes(q);
      if (!matchTitle && !matchVenue && !matchClub) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Hero section matching Codeflying aesthetic */}
      <HeroBanner
        user={user}
        featuredEvents={events}
        onExploreClick={() => setActiveTab('browse')}
        onOpenScanner={onOpenScanner}
        onSelectEvent={(event) => setRegisteringEvent(event)}
      />

      {/* Tab Navigation Content */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Free vs Paid Toggle */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">Fee:</span>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setFeeType('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                    feeType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFeeType('free')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                    feeType === 'free' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Free
                </button>
                <button
                  onClick={() => setFeeType('paid')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                    feeType === 'paid' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Paid
                </button>
              </div>

              <button
                onClick={fetchData}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                title="Refresh Events"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
              <p className="text-sm font-bold text-slate-700">No events found matching your filter.</p>
              <p className="text-xs text-slate-400 mt-1">Try clearing search or selecting a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event._id || event.id}
                  event={event}
                  user={user}
                  isRegistered={isUserRegistered(event._id || event.id)}
                  onRegister={() => setRegisteringEvent(event)}
                  onViewPass={() => setActiveTab('tickets')}
                  onMarkCompleted={handleMarkCompleted}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Passes (Tickets) View */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                My Digital Event Passes ({myTickets.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Present your unique QR code at the gate scanner to verify entry and unlock certificates.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('browse')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              + Register More Events
            </button>
          </div>

          {myTickets.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
              <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-sm text-slate-800">No event passes yet!</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                You haven't registered for any college events. Explore upcoming hackathons and fests.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Explore Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {myTickets.map((ticket) => {
                const matchedEvent = events.find(e => (e._id || e.id) === ticket.eventId);
                return (
                  <TicketCard
                    key={ticket._id || ticket.id}
                    ticket={ticket}
                    event={matchedEvent}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <AnnouncementFeed
          announcements={announcements}
          onRefresh={fetchData}
        />
      )}

      {/* Email & Password Event Registration Modal */}
      <EventRegistrationModal
        isOpen={!!registeringEvent}
        event={registeringEvent}
        onClose={() => setRegisteringEvent(null)}
        onSuccess={() => {
          fetchData();
        }}
      />
    </div>
  );
}
