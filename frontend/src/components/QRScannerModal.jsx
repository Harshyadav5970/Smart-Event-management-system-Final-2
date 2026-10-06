// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Live Gate Scanner Modal using html5-qrcode with Duplicate Scan Detection

import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import confetti from 'canvas-confetti';
import {
  X,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { api } from '../utils/api';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [scanResult, setScanResult] = useState(null); // { status: 'VERIFIED' | 'DUPLICATE_ENTRY' | 'NOT_FOUND', message, data }
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [manualTicketInput, setManualTicketInput] = useState('EH-2026-HACK1');
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {
          // Ignore scanner clear errors
        }
        scannerRef.current = null;
      }
      setCameraActive(false);
      setScanResult(null);
      return;
    }

    // Initialize html5-qrcode scanner when modal opens and camera is requested
    const timer = setTimeout(() => {
      initScanner();
    }, 300);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {}
        scannerRef.current = null;
      }
    };
  }, [isOpen]);

  const initScanner = () => {
    try {
      const scannerElement = document.getElementById('reader');
      if (!scannerElement) return;

      const scanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true
        },
        false
      );

      scanner.render(
        (decodedText) => {
          handleVerify(decodedText);
        },
        (error) => {
          // Scanning in progress, standard frame noise
        }
      );

      scannerRef.current = scanner;
      setCameraActive(true);
    } catch (err) {
      console.warn('Webcam initialization notice:', err.message);
    }
  };

  // Submit scan to backend verification
  const handleVerify = async (rawCode) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await api.post('/tickets/verify-scan', { qrData: rawCode });

      setScanResult(res);

      if (res.status === 'VERIFIED') {
        // Trigger celebratory confetti for first-time legitimate check-in
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        if (onScanSuccess) onScanSuccess(res.data);
      }
    } catch (err) {
      setScanResult({
        success: false,
        status: 'SERVER_ERROR',
        message: 'Scanner communication error with server.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/30 border border-brand-400/40 flex items-center justify-center text-brand-300">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">Gate Entry Scanner</h3>
              <p className="text-[10px] text-slate-400">Live html5-qrcode camera validation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Scan Result Alert Banner */}
          {scanResult && (
            <div
              className={`p-4 rounded-2xl border animate-in zoom-in-95 duration-200 ${
                scanResult.status === 'VERIFIED'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : scanResult.status === 'DUPLICATE_ENTRY'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.status === 'VERIFIED' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-extrabold text-sm">
                    {scanResult.status === 'VERIFIED'
                      ? 'Entry Verified! Welcome Student'
                      : scanResult.status === 'DUPLICATE_ENTRY'
                      ? 'DUPLICATE ENTRY DETECTED!'
                      : 'Validation Warning'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed">{scanResult.message}</p>

                  {scanResult.data && (
                    <div className="mt-2 text-[11px] font-medium opacity-90">
                      <span>Attendee: <strong>{scanResult.data.studentName}</strong></span>
                      <span className="mx-2">•</span>
                      <span>Ticket: <code>{scanResult.data.ticketId}</code></span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setScanResult(null)}
                className="mt-3 text-[11px] font-bold underline hover:opacity-80 block"
              >
                Scan next attendee &rarr;
              </button>
            </div>
          )}

          {/* html5-qrcode camera viewport */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <div id="reader" className="w-full rounded-xl overflow-hidden min-h-[220px]"></div>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Point student pass QR code directly towards camera
            </p>
          </div>

          {/* Examiner Viva Demo Fast-Simulation Strip (Crucial for 100% reliable viva presentation) */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-2">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Viva Rapid Test Simulator (Test Without Webcam)</span>
            </div>
            <p className="text-[11px] text-slate-600 mb-3">
              Click a demo ticket below to immediately demonstrate Green Verified or Red Duplicate check-in:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleVerify('EH-2026-HACK1')}
                disabled={loading}
                className="py-2 px-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left text-xs transition-colors shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>EH-2026-HACK1</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Test 1st Scan (Green)</p>
              </button>

              <button
                type="button"
                onClick={() => handleVerify('EH-2026-WEBC9')}
                disabled={loading}
                className="py-2 px-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-xl text-left text-xs transition-colors shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>EH-2026-WEBC9</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Test Duplicate (Red)</p>
              </button>
            </div>

            {/* Custom Ticket ID Input */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={manualTicketInput}
                onChange={(e) => setManualTicketInput(e.target.value)}
                placeholder="Enter Ticket ID (e.g. EH-2026-XXXX)"
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-400"
              />
              <button
                type="button"
                onClick={() => handleVerify(manualTicketInput)}
                disabled={loading || !manualTicketInput}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Verify
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Author: Harsh Yadav (TYCS 129)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
