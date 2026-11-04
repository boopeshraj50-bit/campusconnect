import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import EventCard from './components/EventCard';
import EventDetailsModal from './components/EventDetailsModal';
import RegistrationModal from './components/RegistrationModal';
import QRTicketModal from './components/QRTicketModal';
import MyRegistrationsView from './components/MyRegistrationsView';
import OrganizerDashboard from './components/OrganizerDashboard';
import AttendeeListModal from './components/AttendeeListModal';
import CreateEventModal from './components/CreateEventModal';
import ApiEndpointsDrawer from './components/ApiEndpointsDrawer';
import Toast from './components/Toast';
import { api } from './services/api';
import { useApp } from './context/AppContext';
import { Sparkles, Calendar, Layers, ShieldCheck, Ticket, Code2, AlertTriangle } from 'lucide-react';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    selectedEventId,
    setSelectedEventId,
    registeringEvent,
    setRegisteringEvent,
    attendeeModalEvent,
    setAttendeeModalEvent,
    isCreateEventOpen,
    setIsCreateEventOpen,
    activeTicket,
    setActiveTicket,
    setIsApiDrawerOpen,
    showToast,
  } = useApp();

  // Events State (GET /api/events)
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // My registrations list for quick badge and check
  const [myRegistrations, setMyRegistrations] = useState([]);

  // Fetch events list from GET /api/events
  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEvents({
        search: searchQuery,
        category: selectedCategory,
        status: selectedStatus,
      });
      setEvents(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch events from /api/events');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's registrations from GET /api/me/registrations
  const loadMyRegistrations = async () => {
    try {
      const data = await api.getMyRegistrations();
      setMyRegistrations(data);
    } catch (err) {
      console.warn('Failed to load my registrations', err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [searchQuery, selectedCategory, selectedStatus]);

  useEffect(() => {
    loadMyRegistrations();
  }, []);

  const handleRegistrationSuccess = (newReg) => {
    loadMyRegistrations();
    loadEvents();
  };

  const handleEventCreated = (newEvent) => {
    loadEvents();
  };

  const handleManageAttendees = (eventId) => {
    const target = events.find((e) => e.id === eventId) || { id: eventId, title: 'Event Attendees' };
    setAttendeeModalEvent(target);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar registrationsCount={myRegistrations.length} />

      {/* Main Container */}
      <main className="flex-1">
        {activeTab === 'browse' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {/* Hero Banner with Search & Filters */}
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              totalEvents={events.length}
            />

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Upcoming Campus Programs</span>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800">
                    GET /api/events
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Showing {events.length} events • Register to secure your seat badge
                </p>
              </div>

              {/* Quick API drawer trigger pill */}
              <button
                onClick={() => setIsApiDrawerOpen(true)}
                className="self-start sm:self-auto text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl border border-brand-200 transition-colors flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Inspect API Endpoints Table</span>
              </button>
            </div>

            {/* Event Grid */}
            {loading ? (
              <div className="p-20 text-center">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-600">
                  Fetching events from <code className="text-brand-600 font-mono">GET /api/events</code>...
                </p>
              </div>
            ) : error ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-rose-200 max-w-lg mx-auto shadow-sm">
                <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">Failed to Load Events</h3>
                <p className="text-xs text-slate-600 mb-4">{error}</p>
                <button
                  onClick={loadEvents}
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
                >
                  Retry Request
                </button>
              </div>
            ) : events.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 max-w-md mx-auto shadow-sm">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No Events Found</h3>
                <p className="text-xs text-slate-500 mb-4">
                  No programs match "{searchQuery}" in category "{selectedCategory}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => {
                  const isRegistered = myRegistrations.some((r) => r.eventId === evt.id);
                  return (
                    <EventCard
                      key={evt.id}
                      event={evt}
                      isRegistered={isRegistered}
                      onViewDetails={(id) => setSelectedEventId(id)}
                      onRegister={(e) => setRegisteringEvent(e)}
                      onManageAttendees={(id) => handleManageAttendees(id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-tickets' && (
          <MyRegistrationsView onBrowseClick={() => setActiveTab('browse')} />
        )}

        {activeTab === 'organizer' && (
          <OrganizerDashboard
            onOpenCreateEvent={() => setIsCreateEventOpen(true)}
            onManageAttendees={(id) => handleManageAttendees(id)}
          />
        )}
      </main>

      {/* Floating Endpoint Drawer Link / Footer */}
      <footer className="bg-white border-t border-purple-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900">CampusConnect</span>
              <span>— Event & Program Management UI</span>
            </div>

            {/* Endpoints Quick Strip matching prompt image */}
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                GET /api/events
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                GET /api/events/:id
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                POST /api/registrations (201/409)
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                GET /api/me/registrations
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold">
                GET /api/events/:id/registrations
              </span>
            </div>

            <div>
              <button
                onClick={() => setIsApiDrawerOpen(true)}
                className="text-brand-600 hover:text-brand-800 font-bold underline flex items-center gap-1"
              >
                <span>Live API Sandbox</span>
                <Code2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <EventDetailsModal
        eventId={selectedEventId}
        onClose={() => setSelectedEventId(null)}
        onRegister={(evt) => setRegisteringEvent(evt)}
        isRegistered={myRegistrations.some((r) => r.eventId === selectedEventId)}
      />

      <RegistrationModal
        event={registeringEvent}
        onClose={() => setRegisteringEvent(null)}
        onSuccess={handleRegistrationSuccess}
      />

      <QRTicketModal
        ticket={activeTicket}
        onClose={() => setActiveTicket(null)}
      />

      <AttendeeListModal
        event={attendeeModalEvent}
        onClose={() => setAttendeeModalEvent(null)}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreated={handleEventCreated}
      />

      <ApiEndpointsDrawer />

      {/* Slide-in Toast Notifications */}
      <Toast />
    </div>
  );
}
