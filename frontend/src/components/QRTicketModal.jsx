import React from 'react';
import { X, Calendar, MapPin, Download, CheckCircle2, Sparkles, Printer, User, QrCode } from 'lucide-react';

export default function QRTicketModal({ ticket, onClose }) {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate an algorithmic QR code grid representation using SVG
  const generateQRMatrix = (seedStr) => {
    const size = 21; // standard version 1 QR matrix size
    const matrix = [];
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        // Finder patterns at corners
        const isTopLeft = r < 7 && c < 7;
        const isTopRight = r < 7 && c >= size - 7;
        const isBottomLeft = r >= size - 7 && c < 7;

        if (isTopLeft || isTopRight || isBottomLeft) {
          const cornerR = isBottomLeft ? r - (size - 7) : r;
          const cornerC = isTopRight ? c - (size - 7) : c;
          const isBorder = cornerR === 0 || cornerR === 6 || cornerC === 0 || cornerC === 6;
          const isCenter = cornerR >= 2 && cornerR <= 4 && cornerC >= 2 && cornerC <= 4;
          row.push(isBorder || isCenter ? 1 : 0);
        } else {
          // Pseudorandom data bits based on seed
          const bit = (Math.abs(hash ^ (r * 31 + c * 17)) >> ((r + c) % 8)) & 1;
          row.push(bit);
        }
      }
      matrix.push(row);
    }
    return matrix;
  };

  const qrMatrix = generateQRMatrix(ticket.ticketCode || ticket.id || 'CC-PASS');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-900/40 hover:bg-slate-900/70 text-white flex items-center justify-center transition-colors print:hidden"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ticket Header */}
        <div className="bg-gradient-to-tr from-brand-900 via-brand-800 to-indigo-900 text-white p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded bg-white/20 text-brand-200">
              CampusConnect Official Pass
            </span>
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confirmed
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-white mb-1">
            {ticket.eventTitle}
          </h2>
          <div className="text-xs text-brand-200 flex items-center gap-2">
            <span>Ticket Code:</span>
            <span className="font-mono font-bold text-amber-300">{ticket.ticketCode}</span>
          </div>
        </div>

        {/* Perforated ticket seam */}
        <div className="relative bg-white py-2 flex items-center justify-between">
          <div className="w-5 h-8 bg-slate-900/70 rounded-r-full -ml-1 print:hidden" />
          <div className="flex-1 border-b-2 border-dashed border-slate-200 mx-2" />
          <div className="w-5 h-8 bg-slate-900/70 rounded-l-full -mr-1 print:hidden" />
        </div>

        {/* Ticket Body with QR & Student Info */}
        <div className="p-6 pt-2 space-y-6">
          {/* QR Code Presentation */}
          <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 mb-3">
              <svg viewBox="0 0 21 21" className="w-44 h-44 shape-rendering-crisp">
                {qrMatrix.map((row, r) =>
                  row.map((cell, c) => (
                    <rect
                      key={`${r}-${c}`}
                      x={c}
                      y={r}
                      width={1}
                      height={1}
                      fill={cell ? '#2e1065' : '#ffffff'}
                    />
                  ))
                )}
              </svg>
            </div>
            <div className="text-center">
              <span className="text-[11px] font-mono text-slate-500 block">
                SCAN AT VENUE ENTRANCE GATE
              </span>
              <span className="text-xs font-mono font-bold text-brand-700">
                {ticket.ticketCode}
              </span>
            </div>
          </div>

          {/* Attendee Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-brand-50/50 p-4 rounded-xl border border-brand-100">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Attendee</span>
              <span className="font-bold text-slate-900">{ticket.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Student ID</span>
              <span className="font-mono font-bold text-brand-800">{ticket.studentId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Department</span>
              <span className="font-medium text-slate-700 truncate block">{ticket.department}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Assigned Desk</span>
              <span className="font-bold text-emerald-700">{ticket.seatNumber || 'General Area'}</span>
            </div>
          </div>

          {/* Logistics */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{ticket.eventDate ? new Date(ticket.eventDate).toLocaleDateString() : 'Nov 15, 2026'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="truncate">{ticket.eventVenue || 'Main Campus Auditorium'}</span>
            </div>
          </div>

          {/* Print / Close Actions */}
          <div className="flex items-center gap-2 pt-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Pass
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all text-center"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
