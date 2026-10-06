// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Digital E-Ticket & Pass Card with Live Verification Status & Certificate Trigger

import React, { useRef } from 'react';
import {
  QrCode,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Clock4,
  Award,
  Download,
  Share2,
  ShieldCheck
} from 'lucide-react';
import { generateEventCertificate } from '../utils/certificateGenerator';
import { printPassCard } from '../utils/printHelper';

export default function TicketCard({ ticket, event, onDownloadCertificate }) {
  const cardRef = useRef(null);
  const isCheckedIn = ticket.checkInStatus === true;
  const isEventCompleted = event?.status === 'Completed' || ticket.eventDate < new Date().toISOString();

  const handleDownloadCert = () => {
    generateEventCertificate({
      studentName: ticket.studentName || 'Harsh Yadav',
      studentRoll: ticket.studentRoll || '129',
      studentDept: ticket.studentDept || 'Computer Science',
      eventTitle: ticket.eventTitle,
      eventDate: ticket.eventDate,
      eventVenue: ticket.eventVenue,
      ticketId: ticket.ticketId,
      guideName: 'Faculty In-Charge'
    });
  };

  const handlePrint = () => {
    if (cardRef.current) {
      printPassCard(cardRef.current);
    } else {
      window.print();
    }
  };

  return (
    <div
      ref={cardRef}
      className="printable-ticket bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden max-w-md w-full mx-auto relative group"
    >
      {/* Top Header Ticket Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-950 p-5 text-white relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">
              College Fest Pass 2026
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/15 backdrop-blur-md">
            {ticket.feePaid === 0 ? 'Free Pass' : `₹${ticket.feePaid} Paid`}
          </span>
        </div>

        <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
          {ticket.eventTitle}
        </h3>

        <div className="mt-2 flex items-center gap-3 text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-brand-300" />
            {ticket.eventDate}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-300" />
            {ticket.eventVenue}
          </span>
        </div>
      </div>

      {/* Ticket Cut-Out Notches for realistic Boarding Pass look */}
      <div className="relative flex items-center justify-between px-3 py-1 bg-slate-50">
        <div className="w-5 h-5 rounded-full bg-[#F8F9FD] -ml-5.5 border-r border-slate-200/80"></div>
        <div className="flex-1 border-b-2 border-dashed border-slate-300 mx-2"></div>
        <div className="w-5 h-5 rounded-full bg-[#F8F9FD] -mr-5.5 border-l border-slate-200/80"></div>
      </div>

      {/* Main Ticket Body */}
      <div className="p-5 pt-3">
        {/* Student Credential Box */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs mb-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendee</p>
            <p className="font-bold text-slate-800 text-sm">{ticket.studentName}</p>
            <p className="text-[11px] text-slate-500">Roll: {ticket.studentRoll || '129'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</p>
            <p className="font-bold text-slate-800">{ticket.studentDept || 'Computer Science'}</p>
            <p className="text-[11px] text-brand-600 font-semibold">TYCS-B</p>
          </div>
        </div>

        {/* QR Code Presentation Box */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-inner mb-4">
          <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-100">
            {ticket.qrCodeData ? (
              <img
                src={ticket.qrCodeData}
                alt={`QR for ${ticket.ticketId}`}
                className="w-40 h-40 object-contain"
              />
            ) : (
              <div className="w-40 h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                <QrCode className="w-12 h-12" />
              </div>
            )}
          </div>

          <div className="mt-2 text-center">
            <span className="font-mono font-bold text-sm tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
              {ticket.ticketId}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              Tamper-Proof Verification Hash Active
            </p>
          </div>
        </div>

        {/* Check-In Gate Status Alert */}
        <div className="mb-4">
          {isCheckedIn ? (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Entry Verified at Gate</p>
                <p className="text-[11px] text-emerald-700">
                  Scanned: {ticket.scannedAt ? new Date(ticket.scannedAt).toLocaleTimeString() : 'Verified'} by {ticket.scannedBy || 'Gate Staff'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3">
              <Clock4 className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Pending Gate Check-In</p>
                <p className="text-[11px] text-amber-700">
                  Present this QR code to the organizer scanner at venue gate.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions Strip - Excluded from Print */}
        <div className="no-print-area space-y-2">
          {/* Certificate Download button if eligible */}
          {isCheckedIn ? (
            <button
              onClick={handleDownloadCert}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-100" />
              <span>Download Verified Certificate (PDF)</span>
            </button>
          ) : (
            <div className="text-center py-1">
              <p className="text-[11px] text-slate-400">
                Certificate unlocks immediately after gate attendance is verified.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
          </div>
        </div>

        {/* Author Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            EventHub • Developed by Harsh Yadav (TYCS Roll 129)
          </p>
        </div>
      </div>
    </div>
  );
}
