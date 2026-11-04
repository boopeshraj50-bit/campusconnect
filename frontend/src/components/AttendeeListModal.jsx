import React, { useState, useEffect } from 'react';
import { X, Search, Download, CheckCircle2, Clock, UserCheck, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export default function AttendeeListModal({ event, onClose }) {
  const { showToast } = useApp();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCheckIn, setFilterCheckIn] = useState('all'); // 'all' | 'checked-in' | 'pending'

  const fetchAttendees = async () => {
    if (!event) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.getEventRegistrations(event.id);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [event]);

  if (!event) return null;

  const handleToggleCheckIn = async (attendeeId) => {
    try {
      const updated = await api.toggleCheckIn(event.id, attendeeId);
      showToast(
        updated.checkedIn
          ? `Attendee ${updated.fullName} checked in!`
          : `Check-in reversed for ${updated.fullName}`,
        'success'
      );
      fetchAttendees();
    } catch (err) {
      showToast('Check-in update failed', 'error');
    }
  };

  // Export attendee roster to CSV
  const handleExportCSV = () => {
    if (!data?.attendees?.length) return;

    const headers = ['Registration ID', 'Full Name', 'Student ID', 'Email', 'Department', 'Year', 'Ticket Code', 'Status', 'Checked In'];
    const rows = data.attendees.map((a) => [
      a.id,
      `"${a.fullName}"`,
      `"${a.studentId}"`,
      `"${a.email}"`,
      `"${a.department || ''}"`,
      `"${a.year || ''}"`,
      `"${a.ticketCode}"`,
      `"${a.status}"`,
      a.checkedIn ? 'YES' : 'NO',
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}_attendee_roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendee roster CSV downloaded successfully!', 'success');
  };

  // Filter list
  const filteredAttendees = (data?.attendees || []).filter((a) => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.studentId.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.ticketCode?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterCheckIn === 'checked-in') return a.checkedIn;
    if (filterCheckIn === 'pending') return !a.checkedIn;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#ea580c] text-white font-mono">
                GET /api/events/{event.id}/registrations
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/80 text-purple-200 border border-purple-700">
                Public endpoint
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              Event Attendee Roster
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{event.title}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-600 font-mono">
                Fetching attendee roster...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-rose-50 rounded-2xl border border-rose-200">
              <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-rose-900 mb-2">
                Unable to load attendees
              </h3>
              <p className="text-xs text-rose-700 max-w-md mx-auto mb-4 leading-relaxed">
                {error.message || 'An error occurred while loading the attendee list.'}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Dismiss
              </button>
            </div>
          ) : data ? (
            <>
              {/* Quick Stats Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100">
                  <div className="text-[11px] font-bold text-brand-700 uppercase">Total Registrations</div>
                  <div className="text-2xl font-black text-brand-900 mt-1">
                    {data.totalRegistrations}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-600 uppercase">Event Capacity</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {data.totalCapacity}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase">Checked In At Gate</div>
                  <div className="text-2xl font-black text-emerald-800 mt-1">
                    {data.checkedInCount}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                  <div className="text-[11px] font-bold text-purple-700 uppercase">Check-in Rate</div>
                  <div className="text-2xl font-black text-purple-900 mt-1">
                    {data.checkInPercentage}%
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, ID, or ticket code..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                    {['all', 'checked-in', 'pending'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setFilterCheckIn(filter)}
                        className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                          filterCheckIn === filter
                            ? 'bg-white text-slate-900 shadow-sm font-bold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {filter.replace('-', ' ')}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSV Export
                  </button>
                </div>
              </div>

              {/* Attendee Table */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Student ID</th>
                      <th className="py-3 px-4">Ticket Code</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4 text-center">Gate Check-in</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAttendees.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No matching attendees found.
                        </td>
                      </tr>
                    ) : (
                      filteredAttendees.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{att.fullName}</div>
                            <div className="text-[11px] text-slate-500">{att.email}</div>
                          </td>

                          <td className="py-3 px-4 font-mono font-semibold text-brand-700">
                            {att.studentId}
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-600">
                            {att.ticketCode}
                          </td>

                          <td className="py-3 px-4 text-slate-600">
                            <div>{att.department}</div>
                            <div className="text-[10px] text-slate-400">{att.year}</div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleCheckIn(att.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 mx-auto ${
                                att.checkedIn
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700 border border-slate-200'
                              }`}
                            >
                              {att.checkedIn ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  Checked In
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  Mark Entry
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
