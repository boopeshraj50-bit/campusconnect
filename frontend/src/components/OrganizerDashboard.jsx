import React, { useState, useEffect } from 'react';
import { Plus, Users, ShieldCheck, Calendar, ArrowRight, BarChart3, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export default function OrganizerDashboard({ onOpenCreateEvent, onManageAttendees }) {
  const { user, role, setRole, showToast } = useApp();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizerEvents = async () => {
    setLoading(true);
    try {
      const allEvents = await api.getEvents();
      // Filter events owned by this organizer (or all if organizer)
      const myEvents = allEvents.filter((e) => e.organizerId === user.organizerProfile?.id);
      setEvents(myEvents.length > 0 ? myEvents : allEvents.slice(0, 3));
    } catch (err) {
      showToast(err.message || 'Failed to load organizer events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerEvents();
  }, [user, role]);

  const totalAttendees = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
  const avgFillRate = totalCapacity > 0 ? Math.round((totalAttendees / totalCapacity) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Switch role alert if in student mode */}
      {role !== 'organizer' && (
        <div className="mb-6 p-4 rounded-2xl bg-brand-50 border border-brand-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-brand-900">
            <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
            <span>
              You are currently viewing in <strong>Student Mode</strong>. Switch to <strong>Organizer Mode</strong> to access attendee verification & check-ins.
            </span>
          </div>
          <button
            onClick={() => setRole('organizer')}
            className="px-3.5 py-1.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors shrink-0"
          >
            Switch to Organizer Mode
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Owning Organizer Portal: {user.organizerProfile?.name || 'ACM Chapter'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Organizer Management Studio
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Track registration capacities, access student attendee rosters, and manage venue check-ins.
          </p>
        </div>

        <button
          onClick={onOpenCreateEvent}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          Create New Event
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Hosted Programs</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{events.length}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">Active this semester</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Total Registered</span>
            <div className="text-3xl font-black text-brand-700 mt-1">{totalAttendees}</div>
            <span className="text-[11px] text-slate-500">Across your events</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Capacity Filled</span>
            <div className="text-3xl font-black text-purple-700 mt-1">{avgFillRate}%</div>
            <span className="text-[11px] text-slate-500">{totalCapacity} total seat capacity</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Managed Events List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Managed Events & Rosters</h2>
          <span className="text-xs text-slate-500">
            Protected endpoint: <code className="text-[#ea580c] font-mono font-bold">GET /api/events/{'{id}'}/registrations</code>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-brand-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={evt.coverImage}
                  alt={evt.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                      {evt.category}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{evt.id}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{evt.title}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{evt.venue}</span>
                    <span>•</span>
                    <span>{evt.timeString || 'TBA'}</span>
                  </div>
                </div>
              </div>

              {/* Progress & Attendee Button */}
              <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-medium">Registrations</div>
                  <div className="text-sm font-bold text-slate-800">
                    {evt.registeredCount} / {evt.capacity} seats
                  </div>
                </div>

                <button
                  onClick={() => onManageAttendees(evt.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View Attendee List</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
