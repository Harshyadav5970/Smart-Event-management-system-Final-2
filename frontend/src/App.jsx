// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Project Guide: Ms. Pranali Thakare
// Main Application Component with Dual Dashboard Modes & Modals

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StudentDashboard from './pages/StudentDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import QRScannerModal from './components/QRScannerModal';
import CreateEventModal from './components/CreateEventModal';
import ProjectSynopsisModal from './components/ProjectSynopsisModal';

function AppContent() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'tickets' | 'analytics' | 'announcements'
  const [searchQuery, setSearchQuery] = useState('');

  // Global modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isSynopsisOpen, setIsSynopsisOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-coral-500 animate-spin flex items-center justify-center text-white font-bold text-sm">
            ⚡
          </div>
          <p className="text-xs font-bold text-slate-600">Loading EventHub...</p>
        </div>
      </div>
    );
  }

  // Not logged in: Show Login / Register
  if (!user) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex text-slate-900">
      {/* Left Sidebar (Codeflying style) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenCreateEvent={() => setIsCreateEventOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenSynopsis={() => setIsSynopsisOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSynopsis={() => setIsSynopsisOpen(true)}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Render Active View based on Role & Active Tab */}
          {activeTab === 'analytics' && user.role === 'admin' ? (
            <AdminDashboard
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenCreateEvent={() => setIsCreateEventOpen(true)}
            />
          ) : activeTab === 'analytics' && user.role === 'organizer' ? (
            <OrganizerDashboard
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenCreateEvent={() => setIsCreateEventOpen(true)}
            />
          ) : (
            <StudentDashboard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenCreateEvent={() => setIsCreateEventOpen(true)}
              onOpenSynopsis={() => setIsSynopsisOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={() => {}}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onEventCreated={() => {
          setActiveTab('browse');
        }}
      />

      <ProjectSynopsisModal
        isOpen={isSynopsisOpen}
        onClose={() => setIsSynopsisOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
