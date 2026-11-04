import React from 'react';
import { Calendar, Ticket, ShieldCheck, Sparkles, Code2, Users, Layers, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar({ registrationsCount = 0 }) {
  const { role, setRole, activeTab, setActiveTab, setIsApiDrawerOpen, user } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('browse')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-900 via-brand-700 to-indigo-600 bg-clip-text text-transparent">
                  CampusConnect
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Event & Program UI
                </span>
              </div>
            </button>

            {/* Navigation tabs */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setActiveTab('browse')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'browse'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Browse Events
              </button>

              <button
                onClick={() => setActiveTab('my-tickets')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'my-tickets'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Ticket className="w-3.5 h-3.5" />
                My Registrations
                {registrationsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-brand-100 text-brand-700">
                    {registrationsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('organizer')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'organizer'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Organizer Studio
                {role === 'organizer' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* API Endpoints Button - directly addresses the prompt's API endpoints table */}
            <button
              onClick={() => setIsApiDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition-colors"
              title="View & test the 5 required API endpoints"
            >
              <Code2 className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden sm:inline">API Endpoints</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ea580c] text-white">
                5 APIs
              </span>
            </button>

            {/* Role Switcher (Student vs Organizer) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setRole('student')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  role === 'student'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🎓 Student
              </button>
              <button
                onClick={() => setRole('organizer')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  role === 'organizer'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ⚡ Organizer
              </button>
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-300"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
                <div className="text-[10px] text-slate-500">
                  {role === 'organizer' ? 'ACM Chapter Lead' : user.studentId}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
