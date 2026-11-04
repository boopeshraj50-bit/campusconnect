import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Users, Clock, ShieldCheck, Share2, CheckCircle2, AlertTriangle, ArrowRight, Video } from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export default function EventDetailsModal({ eventId, onClose, onRegister, isRegistered }) {
  const { showToast, role, user, setAttendeeModalEvent } = useApp();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchEventDetails() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getEventById(eventId);
        if (mounted) setEvent(data);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load event details');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (eventId) {
      fetchEventDetails();
    }
    return () => {
      mounted = false;
    };
  }, [eventId]);

  if (!eventId) return null;

  const isOwner = role === 'organizer' && user.organizerProfile?.id === event?.organizerId;
  const isFull = event && event.registeredCount >= event.capacity;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Event link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-lg backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-600">
              Loading event details from <code className="text-brand-600 font-mono">GET /api/events/{eventId}</code>...
            </p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">Error Loading Event</h3>
            <p className="text-sm text-slate-600 mb-6">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Close
            </button>
          </div>
        ) : event ? (
          <div>
            {/* Hero Cover Banner */}
            <div className="relative h-64 sm:h-80 w-full bg-slate-900">
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow-md">
                  {event.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20">
                  {event.type}
                </span>
              </div>

              {/* Title & Organizer Info */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={event.organizer?.avatar}
                    alt={event.organizer?.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-white/50"
                  />
                  <span className="text-xs font-medium text-brand-200">
                    Hosted by {event.organizer?.name}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {event.title}
                </h1>
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About Event */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">About This Event</h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>

                {/* Event Schedule Timeline */}
                {event.timeline && event.timeline.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-brand-600" />
                      Program Timeline & Schedule
                    </h3>
                    <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-brand-100">
                      {event.timeline.map((item, idx) => (
                        <div key={idx} className="relative flex items-start gap-4 pl-8">
                          <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-brand-600 ring-4 ring-brand-50" />
                          <div className="flex-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-brand-700 block mb-0.5 font-mono">
                              {item.time}
                            </span>
                            <div className="text-sm font-bold text-slate-800">{item.title}</div>
                            {item.desc && <div className="text-xs text-slate-500 mt-1">{item.desc}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guest Speakers */}
                {event.speakers && event.speakers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Keynote Speakers & Judges</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {event.speakers.map((sp, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3.5 rounded-2xl bg-brand-50/50 border border-brand-100"
                        >
                          <img
                            src={sp.avatar}
                            alt={sp.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-300"
                          />
                          <div>
                            <div className="font-bold text-sm text-slate-900">{sp.name}</div>
                            <div className="text-xs text-slate-500">{sp.title}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements & Guidelines */}
                {event.requirements && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                      Event Requirements & Guidelines
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                      {event.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Col: Logistics & Registration Card */}
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Registration</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                      {event.price || 'Free Pass'}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">Date & Schedule</div>
                        <div>{event.timeString || 'Nov 15, 2026'}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">Venue / Location</div>
                        <div>{event.venue}</div>
                        {event.onlineUrl && (
                          <a
                            href={event.onlineUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-brand-600 hover:underline mt-1 font-semibold"
                          >
                            <Video className="w-3 h-3" />
                            Join Virtual Stream
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">Availability</div>
                        <div>
                          {event.registeredCount} of {event.capacity} seats filled
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isFull ? 'bg-rose-500' : 'bg-brand-600'
                      }`}
                      style={{
                        width: `${Math.min(100, (event.registeredCount / event.capacity) * 100)}%`,
                      }}
                    />
                  </div>

                  {/* Action CTA */}
                  {isOwner ? (
                    <button
                      onClick={() => {
                        onClose();
                        setAttendeeModalEvent(event);
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Manage Attendees List
                    </button>
                  ) : isRegistered ? (
                    <div className="w-full py-3 px-4 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      You are already registered!
                    </div>
                  ) : isFull ? (
                    <div className="w-full py-3 px-4 rounded-xl bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      Event is fully booked
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        onClose();
                        onRegister(event);
                      }}
                      className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 hover:scale-[1.02]"
                    >
                      Register For This Event
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Event
                  </button>
                </div>

                {/* Organizer Verification Card */}
                <div className="p-4 rounded-2xl border border-purple-100 bg-brand-50/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                    ACM
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      {event.organizer?.name}
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    </div>
                    <div className="text-slate-500">{event.organizer?.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
