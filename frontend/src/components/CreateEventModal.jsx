import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Plus, Image as ImageIcon, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export default function CreateEventModal({ isOpen, onClose, onCreated }) {
  const { user, showToast } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Hackathons',
    venue: '',
    timeString: '',
    capacity: 100,
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    description: '',
    isOnline: false,
    tags: 'Campus, Engineering, Innovation',
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tagList = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const newEvent = await api.createEvent(
        {
          ...formData,
          tags: tagList,
        },
        user
      );

      showToast(`Event "${newEvent.title}" published! Available under GET /api/events`, 'success');
      onCreated(newEvent);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to create event', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-800 to-indigo-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-200 px-2.5 py-0.5 rounded bg-white/10 inline-block mb-1">
            Organizer Studio
          </span>
          <h2 className="text-xl font-bold tracking-tight">Create & Publish Campus Event</h2>
          <p className="text-xs text-brand-100/90 mt-0.5">
            Publishes immediately to the public discovery feed (<code className="text-amber-300">GET /api/events</code>)
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. NextGen Web Dev Bootcamp & Hack"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option>Hackathons</option>
                <option>Workshops</option>
                <option>Cultural</option>
                <option>Seminars</option>
                <option>Sports</option>
                <option>Tech Talks</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Max Seat Capacity
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Date & Time String
              </label>
              <input
                type="text"
                required
                value={formData.timeString}
                onChange={(e) => setFormData({ ...formData, timeString: e.target.value })}
                placeholder="e.g. Dec 12, 10:00 AM – 4:00 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Venue / Campus Hall
              </label>
              <input
                type="text"
                required
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. Main Auditorium, Block 3"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Cover Image URL (Unsplash or campus CDN)
            </label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Event Description & Agenda
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline what students will learn, participate in, prizes, or guest speakers..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                'Publishing Event...'
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Publish Event to CampusConnect
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
