import React, { useState } from 'react';
import { X, Play, Check, AlertCircle, Copy, Terminal, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function ApiEndpointsDrawer() {
  const { isApiDrawerOpen, setIsApiDrawerOpen, user } = useApp();
  const [activeTest, setActiveTest] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isApiDrawerOpen) return null;

  const endpoints = [
    {
      method: 'GET',
      endpoint: '/api/events',
      description: 'Browse events.',
      testAction: async () => {
        return await api.getEvents({ search: '', category: 'All' });
      },
    },
    {
      method: 'GET',
      endpoint: '/api/events/{id}',
      description: 'Event details.',
      testAction: async () => {
        const events = await api.getEvents();
        if (!events.length) throw new Error('No events found. Add an event first.');
        return await api.getEventById(events[0].id);
      },
    },
    {
      method: 'POST',
      endpoint: '/api/registrations',
      description: 'Create registration, 201 or 409.',
      testAction: async () => {
        // Test registering with student ID
        try {
          const events = await api.getEvents();
          if (!events.length) throw new Error('No events found. Add an event first.');
          return await api.createRegistration({
            eventId: events[0].id,
            fullName: user.name,
            email: user.email,
            studentId: user.studentId,
            department: user.department,
            year: user.year,
            specialNotes: 'Tested via API Drawer',
          });
        } catch (err) {
          return {
            status: err.status || 500,
            error: err.message,
            payload: err.data || null,
          };
        }
      },
    },
    {
      method: 'GET',
      endpoint: '/api/me/registrations',
      description: 'Registrations for the demo student ID.',
      testAction: async () => {
        return await api.getMyRegistrations();
      },
    },
    {
      method: 'GET',
      endpoint: '/api/events/{id}/registrations',
      description: 'Public attendee list.',
      testAction: async () => {
        const events = await api.getEvents();
        if (!events.length) throw new Error('No events found. Add an event first.');
        return await api.getEventRegistrations(events[0].id);
      },
    },
  ];

  const runTest = async (ep, index) => {
    setActiveTest(index);
    setLoading(true);
    setTestResult(null);
    try {
      const res = await ep.testAction();
      setTestResult({
        endpoint: ep.endpoint,
        method: ep.method,
        status: res?.status || 200,
        data: res,
      });
    } catch (err) {
      setTestResult({
        endpoint: ep.endpoint,
        method: ep.method,
        status: err.status || 500,
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyEndpoint = (text, index) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-brand-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-brand-600 text-white">
                Figma Spec
              </span>
              <h2 className="text-xl font-bold text-slate-900">API Endpoints Reference</h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Specification matching the prompt design table with live interactive responses.
            </p>
          </div>
          <button
            onClick={() => setIsApiDrawerOpen(false)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Visual Table Styled Exactly Like The Figma Screenshot */}
          <div className="rounded-2xl border border-brand-200 overflow-hidden shadow-sm bg-white">
            <div className="bg-[#ede9fe] px-5 py-3.5 grid grid-cols-12 gap-3 font-bold text-slate-900 text-sm">
              <div className="col-span-3 text-brand-900">Method</div>
              <div className="col-span-4 text-brand-900">Endpoint</div>
              <div className="col-span-5 text-brand-900">Description</div>
            </div>

            <div className="divide-y divide-purple-100">
              {endpoints.map((ep, idx) => (
                <div
                  key={idx}
                  className="px-5 py-3.5 grid grid-cols-12 gap-3 items-center text-sm hover:bg-brand-50/50 transition-colors"
                >
                  <div className="col-span-3">
                    <span
                      className={`font-mono font-bold text-xs px-2.5 py-1 rounded ${
                        ep.method === 'GET'
                          ? 'bg-indigo-100 text-[#4338ca]'
                          : 'bg-emerald-100 text-[#047857]'
                      }`}
                    >
                      {ep.method}
                    </span>
                  </div>

                  <div className="col-span-4">
                    <span className="font-mono font-bold text-[#ea580c] text-xs break-all">
                      {ep.endpoint}
                    </span>
                  </div>

                  <div className="col-span-5 flex items-center justify-between gap-2">
                    <span className="text-slate-800 text-xs font-medium">{ep.description}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => copyEndpoint(ep.endpoint, idx)}
                        title="Copy endpoint"
                        className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                      >
                        {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => runTest(ep, idx)}
                        disabled={loading && activeTest === idx}
                        title="Test Live"
                        className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-sm"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Public endpoint notice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-800">
                API endpoints do not require authentication or role checks.
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">
              Attendee roster is public
            </span>
          </div>

          {/* Live Test Console Output */}
          {activeTest !== null && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg text-slate-100">
              <div className="px-4 py-2.5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>
                    {endpoints[activeTest].method}{' '}
                    <span className="text-amber-400">{endpoints[activeTest].endpoint}</span>
                  </span>
                </div>
                {testResult && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                      testResult.status >= 200 && testResult.status < 300
                        ? 'bg-emerald-900/80 text-emerald-300'
                        : testResult.status === 409
                        ? 'bg-amber-900/80 text-amber-300'
                        : 'bg-rose-900/80 text-rose-300'
                    }`}
                  >
                    HTTP {testResult.status}
                  </span>
                )}
              </div>

              <div className="p-4 max-h-72 overflow-y-auto font-mono text-xs leading-relaxed">
                {loading ? (
                  <div className="text-slate-400 animate-pulse flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Sending request to endpoint...
                  </div>
                ) : testResult ? (
                  <pre className="text-emerald-300 whitespace-pre-wrap break-all">
                    {JSON.stringify(testResult.data || testResult.error, null, 2)}
                  </pre>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
