import React from 'react';
import { Search, Sparkles, Filter, CalendarDays, MapPin, Users } from 'lucide-react';

const CATEGORIES = ['All', 'Hackathons', 'Workshops', 'Cultural', 'Seminars', 'Sports', 'Tech Talks'];

export default function HeroBanner({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  totalEvents = 0,
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 my-6 shadow-xl shadow-brand-950/20">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-200 text-xs font-semibold mb-4 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-300" />
          <span>Figma CampusConnect — Official Portal</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Discover, Register & Lead{' '}
          <span className="bg-gradient-to-r from-brand-300 via-purple-200 to-amber-200 bg-clip-text text-transparent">
            Campus Events
          </span>
        </h1>

        <p className="text-sm sm:text-base text-brand-100/90 mb-8 max-w-2xl leading-relaxed">
          From 36-hour flagship hackathons to cultural festivals and tech bootcamps. Register with one click, get digital QR tickets, or manage attendees in real time.
        </p>

        {/* Search Bar Input */}
        <div className="relative max-w-2xl mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event title, organizer, keywords, or location (e.g. HackNova, ACM, Quantum)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium shadow-lg focus:outline-none focus:ring-4 focus:ring-brand-400/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-brand-900 shadow-md font-bold scale-105'
                  : 'bg-white/10 text-white/90 hover:bg-white/20 backdrop-blur-sm border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quick stats banner on the bottom right */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-brand-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-brand-300" />
            <span>
              <strong className="text-white">{totalEvents}</strong> Active Events Listed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-300" />
            <span>
              <strong className="text-white">1,600+</strong> Campus Registrations
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Instant Digital Pass Generation</span>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-brand-300">Status:</span>
          {['All', 'Upcoming'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                selectedStatus === st
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/10 text-brand-200 hover:bg-white/20'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
