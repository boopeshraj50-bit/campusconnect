import React from 'react';
import { Calendar, MapPin, Users, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function EventCard({
  event,
  isRegistered = false,
  onViewDetails,
  onRegister,
  onManageAttendees,
}) {
  const isFull = event.registeredCount >= event.capacity;
  const fillPercentage = event.capacity > 0
    ? Math.min(100, Math.round((event.registeredCount / event.capacity) * 100))
    : 0;

  // Format date
  const eventDate = new Date(event.date);
  const hasValidDate = !Number.isNaN(eventDate.getTime());
  const month = hasValidDate
    ? eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    : 'DATE';
  const day = hasValidDate ? eventDate.getDate() : 'TBA';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card-hover hover:border-brand-300 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Cover Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Date Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl p-2 text-center shadow-md min-w-[50px] border border-white/40">
          <span className="block text-[10px] font-extrabold text-brand-700 tracking-wider leading-none">
            {month}
          </span>
          <span className="block text-lg font-black text-slate-900 leading-tight">
            {day}
          </span>
        </div>

        {/* Category & Status Pills */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-600/90 text-white backdrop-blur-md shadow-sm">
            {event.category}
          </span>
          {event.isOnline && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white backdrop-blur-md">
              Virtual / Hybrid
            </span>
          )}
        </div>

        {/* Title over gradient */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5 text-xs text-brand-200 font-medium">
            <span className="truncate">{event.organizer?.name}</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-brand-700 transition-colors line-clamp-1 mb-2">
            {event.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {event.shortDescription || event.description}
          </p>

          {/* Logistics: Time & Venue */}
          <div className="space-y-1.5 text-xs text-slate-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate">{event.timeString || 'TBA'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags?.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Capacity Bar & Action Buttons */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Seats Filled
            </span>
            <span className={`font-bold ${isFull ? 'text-rose-600' : 'text-slate-700'}`}>
              {event.registeredCount} / {event.capacity}
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull
                  ? 'bg-rose-500'
                  : fillPercentage > 85
                  ? 'bg-amber-500'
                  : 'bg-brand-600'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(event.id)}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-center"
            >
              Details
            </button>

            {isRegistered ? (
              <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Registered
              </div>
            ) : isFull ? (
              <div className="flex-1 py-2 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                Sold Out
              </div>
            ) : (
              <button
                onClick={() => onRegister(event)}
                className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm shadow-brand-500/20 flex items-center justify-center gap-1 group-hover:gap-1.5"
              >
                Register
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onManageAttendees(event.id)}
              className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              Attendees
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
