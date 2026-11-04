import React from 'react';
import { Search, Sparkles, CalendarDays, Users, ArrowUpRight, MapPin } from 'lucide-react';

const CATEGORIES = ['All', 'Hackathons', 'Workshops', 'Cultural', 'Seminars', 'Sports', 'Tech Talks'];

export default function HeroBanner({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedStatus, setSelectedStatus, totalEvents = 0 }) {
  return (
    <section className="hero-shell relative overflow-hidden rounded-[2rem] my-7">
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <div className="hero-grid-pattern" />
      <div className="relative z-10 grid lg:grid-cols-[1.35fr_.65fr] gap-8 lg:gap-12 p-6 sm:p-9 lg:p-12">
        <div className="max-w-3xl">
          <div className="hero-eyebrow"><span className="hero-eyebrow-dot" /><Sparkles className="w-3.5 h-3.5" /> YOUR CAMPUS. YOUR COMMUNITY.</div>
          <h1 className="hero-title">Make campus life<br /><span>happen here.</span></h1>
          <p className="hero-description">Find your next big idea, meet your people, and be part of experiences worth remembering. Everything happening on campus, all in one place.</p>
          <div className="hero-search-wrap">
            <Search className="w-5 h-5" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search events, clubs, workshops or venues..." />
            {searchQuery && <button onClick={() => setSearchQuery('')}>Clear</button>}
            <span className="hero-search-hint">⌘ K</span>
          </div>
          <div className="hero-category-row">
            {CATEGORIES.map((cat) => <button key={cat} onClick={() => setSelectedCategory(cat)} className={`hero-category ${selectedCategory === cat ? 'active' : ''}`}>{cat}</button>)}
          </div>
        </div>
        <div className="hero-side hidden lg:flex flex-col justify-between">
          <div className="hero-side-top"><span className="hero-side-label">THE CAMPUS CALENDAR</span><ArrowUpRight className="w-5 h-5" /></div>
          <div className="hero-feature-card">
            <div className="hero-feature-icon"><CalendarDays className="w-6 h-6" /></div>
            <div className="hero-feature-number">{totalEvents.toString().padStart(2, '0')}</div>
            <div className="hero-feature-title">Things to look forward to</div>
            <div className="hero-feature-caption">Discover what's happening around you.</div>
            <div className="hero-feature-bottom"><span><span className="hero-live-dot" /> LIVE EVENT LISTINGS</span><MapPin className="w-4 h-4" /></div>
          </div>
          <div className="hero-side-foot"><Users className="w-4 h-4" /> Built for the people who make campus memorable.</div>
        </div>
        <div className="hero-mobile-stats lg:hidden">
          <div><strong>{totalEvents}</strong><span>Events listed</span></div>
          <div><strong>One place</strong><span>For campus life</span></div>
        </div>
      </div>
      <div className="hero-bottom-bar">
        <div className="hero-stat"><CalendarDays className="w-4 h-4" /><span><strong>{totalEvents}</strong> active events</span></div>
        <div className="hero-stat"><Users className="w-4 h-4" /><span><strong>One community</strong> endless possibilities</span></div>
        <div className="hero-status"><span>SHOW</span>{['All', 'Upcoming'].map((st) => <button key={st} onClick={() => setSelectedStatus(st)} className={selectedStatus === st ? 'active' : ''}>{st}</button>)}</div>
      </div>
    </section>
  );
}
