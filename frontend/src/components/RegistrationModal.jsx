import React, { useState } from 'react';
import { X, Ticket, AlertTriangle, CheckCircle2, User, Mail, Hash, BookOpen, Clock, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export default function RegistrationModal({ event, onClose, onSuccess }) {
  const { user, showToast, setActiveTicket } = useApp();

  const [formData, setFormData] = useState({
    fullName: user.name || '',
    email: user.email || '',
    studentId: user.studentId || '',
    department: user.department || 'Computer Science & Engineering',
    year: user.year || '3rd Year (Junior)',
    specialNotes: '',
    agreedToTerms: true,
  });

  const [loading, setLoading] = useState(false);
  const [conflictError, setConflictError] = useState(null);

  if (!event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConflictError(null);
    setLoading(true);

    try {
      const response = await api.createRegistration({
        eventId: event.id,
        fullName: formData.fullName,
        email: formData.email,
        studentId: formData.studentId,
        department: formData.department,
        year: formData.year,
        specialNotes: formData.specialNotes,
      });

      if (response.status === 201) {
        showToast(
          'Registration successful! Your digital ticket has been issued.',
          'success',
          'HTTP 201 Created'
        );
        onSuccess(response.data.registration);
        setActiveTicket(response.data.registration);
        onClose();
      }
    } catch (err) {
      if (err.status === 409) {
        setConflictError({
          title: 'Registration Conflict (HTTP 409)',
          message: err.message || 'You are already registered for this event.',
          code: err.code || 'ALREADY_REGISTERED',
        });
        showToast(err.message, 'conflict', 'HTTP 409 Conflict');
      } else {
        setConflictError({
          title: 'Registration Error',
          message: err.message || 'An error occurred while creating registration.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-700 to-indigo-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-brand-100 text-[11px] font-semibold mb-2">
            <Ticket className="w-3.5 h-3.5" />
            <span>Endpoint: POST /api/registrations</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight">Event Registration</h2>
          <p className="text-xs text-brand-100/90 mt-1 line-clamp-1">{event.title}</p>
        </div>

        {/* 409 Conflict Banner */}
        {conflictError && (
          <div className="m-6 mb-0 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-bold mb-1">{conflictError.title}</div>
                <div className="text-amber-800 leading-relaxed">{conflictError.message}</div>
              </div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Student Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Student ID / Roll No.
              </label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department / Major
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Academic Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium bg-white"
              >
                <option>1st Year (Freshman)</option>
                <option>2nd Year (Sophomore)</option>
                <option>3rd Year (Junior)</option>
                <option>4th Year (Senior)</option>
                <option>Graduate / Postgrad</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Special Requirements / Dietary Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.specialNotes}
              onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
              placeholder="e.g., Team name, vegetarian dietary preference, wheelchair accessibility"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing POST /api/registrations...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Confirm Registration & Generate Pass
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
