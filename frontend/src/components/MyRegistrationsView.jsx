import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, MapPin, QrCode, Download, Trash2, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export default function MyRegistrationsView({ onBrowseClick }) {
  const { setActiveTicket, showToast } = useApp();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const data = await api.getMyRegistrations();
      setRegistrations(data);
    } catch (err) {
      showToast(err.message || 'Failed to load registrations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async (id, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"? Your seat will be freed for other students.`)) {
      return;
    }

    try {
      await api.cancelRegistration(id);
      showToast('Registration cancelled. Seat freed.', 'info');
      fetchRegistrations();
    } catch (err) {
      showToast(err.message || 'Failed to cancel', 'error');
    }
  };

  // Generate .ics calendar download
  const downloadCalendarEvent = (reg) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CampusConnect//Event Pass//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${reg.eventTitle}`,
      `DESCRIPTION:CampusConnect Ticket Code: ${reg.ticketCode}\\nStudent: ${reg.fullName} (${reg.studentId})`,
      `LOCATION:${reg.eventVenue}`,
      `DTSTART:${new Date(reg.eventDate || Date.now()).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${reg.ticketCode || 'event'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Calendar invite (.ics) downloaded!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold mb-2">
            <Ticket className="w-3.5 h-3.5" />
            <span>Endpoint: GET /api/me/registrations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Registrations & Tickets
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Access your university entry badges, scannable QR passes, and seat allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white p-3 px-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="text-xs text-slate-500 font-medium">Active Passes</div>
            <div className="text-xl font-black text-brand-700">{registrations.length}</div>
          </div>
          <div className="bg-white p-3 px-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="text-xs text-slate-500 font-medium">Status</div>
            <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              All Confirmed
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-600 font-mono">
            Calling GET /api/me/registrations...
          </p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-sm">
          <Ticket className="w-16 h-16 text-brand-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">No Registrations Yet</h3>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            You haven't registered for any events yet. Explore upcoming hackathons, workshops, and campus cultural festivals.
          </p>
          <button
            onClick={onBrowseClick}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            Explore Campus Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:border-brand-300 hover:shadow-card-hover transition-all"
            >
              {/* Left thumbnail banner */}
              <div className="sm:w-48 h-36 sm:h-auto relative bg-slate-100 shrink-0">
                <img
                  src={reg.coverImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop&q=80'}
                  alt={reg.eventTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-600 text-white">
                    {reg.category || 'Event'}
                  </span>
                </div>
              </div>

              {/* Right Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                      {reg.ticketCode}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Confirmed
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 mb-2">
                    {reg.eventTitle}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{reg.eventDate ? new Date(reg.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Nov 15, 2026'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{reg.eventVenue}</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Action Toolbar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveTicket(reg)}
                    className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    Show QR Pass
                  </button>

                  <button
                    onClick={() => downloadCalendarEvent(reg)}
                    title="Add to Google / Apple Calendar"
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCancel(reg.id, reg.eventTitle)}
                    title="Cancel Registration"
                    className="p-2 rounded-xl border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
