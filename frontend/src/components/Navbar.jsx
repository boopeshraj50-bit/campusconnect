import React from 'react';
import { CalendarDays, Ticket, ShieldCheck, Sparkles, Code2, Users, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar({ registrationsCount = 0 }) {
  const { role, setRole, activeTab, setActiveTab, setIsApiDrawerOpen, user } = useApp();
  const navItems = [
    { id: 'browse', label: 'Discover', icon: CalendarDays },
    { id: 'my-tickets', label: 'My tickets', icon: Ticket, count: registrationsCount },
    { id: 'organizer', label: 'Organizer', icon: Users, active: role === 'organizer' },
  ];
  return (
    <header className="app-navbar sticky top-0 z-40">
      <div className="navbar-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => setActiveTab('browse')} className="brand-lockup">
          <span className="brand-mark"><Sparkles className="w-5 h-5" /></span>
          <span className="brand-copy"><strong>campus<span>connect</span></strong><small>THE CAMPUS EXPERIENCE PLATFORM</small></span>
        </button>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`nav-link ${activeTab === id ? 'selected' : ''}`}>
              <Icon className="w-4 h-4" />{label}{id === 'my-tickets' && count > 0 ? <span className="nav-count">{count}</span> : null}
            </button>
          ))}
        </nav>
        <div className="navbar-actions">
          <button onClick={() => setIsApiDrawerOpen(true)} className="api-nav-button" title="View and test API endpoints"><Code2 className="w-4 h-4" /><span>API tools</span><span className="api-count">5</span></button>
          <div className="role-switcher" aria-label="Choose role">
            <button onClick={() => setRole('student')} className={role === 'student' ? 'active' : ''}>Student</button>
            <button onClick={() => setRole('organizer')} className={role === 'organizer' ? 'active' : ''}>Organizer</button>
          </div>
          <div className="user-chip"><img src={user.avatar} alt={user.name} /><div><strong>{user.name}</strong><small>{role === 'organizer' ? 'Organizer' : user.studentId}</small></div><ArrowUpRight className="user-chevron w-3.5 h-3.5" /></div>
        </div>
      </div>
      <div className="mobile-nav-wrap"><nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map(({ id, label, icon: Icon, count }) => <button key={id} onClick={() => setActiveTab(id)} className={activeTab === id ? 'selected' : ''}><Icon className="w-4 h-4" />{label}{id === 'my-tickets' && count > 0 ? ` (${count})` : ''}</button>)}</nav></div>
    </header>
  );
}
