import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast, setToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    conflict: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900',
    conflict: 'border-amber-200 bg-amber-50 text-amber-900',
    info: 'border-indigo-200 bg-indigo-50 text-indigo-900',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${borders[toast.type] || borders.info}`}>
        {icons[toast.type] || icons.info}
        <div className="flex-1 text-sm">
          {toast.title && <div className="font-semibold mb-0.5">{toast.title}</div>}
          <div className="text-slate-700 text-xs leading-relaxed">{toast.message}</div>
        </div>
        <button
          onClick={() => setToast(null)}
          className="text-slate-400 hover:text-slate-600 transition-colors -mt-1 -mr-1 p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
