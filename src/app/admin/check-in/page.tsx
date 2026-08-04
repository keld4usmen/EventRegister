"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { CheckCircle, XCircle, AlertTriangle, Scan } from 'lucide-react';

export default function CheckInPage() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isScanning) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          rememberLastUsedCamera: true
        },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [isScanning]);

  const onScanSuccess = async (decodedText: string) => {
    // Stop scanning while processing
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    
    try {
      const response = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCodeString: decodedText })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Failed to process ticket");
        setScanResult(null);
      } else {
        setScanResult(data);
        setError(null);
      }
    } catch (err) {
      setError("Network error occurred.");
    }
  };

  const onScanFailure = (error: any) => {
    // Ignore minor scan errors (like blurriness)
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setIsScanning(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">QR Code Check-in</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scanner Side */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col items-center">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Scan className="text-[#00aeef]" /> Live Camera
          </h3>
          
          <div className="w-full bg-black/50 rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center relative">
            {isScanning ? (
              <div id="qr-reader" className="w-full" style={{ border: 'none' }}></div>
            ) : (
              <div className="text-center p-6">
                <p className="text-gray-400 mb-4">Scanner paused</p>
                <button 
                  onClick={resetScanner}
                  className="px-6 py-2 bg-[#f26c22] rounded-lg font-medium hover:bg-[#f26c22]/90 transition-colors"
                >
                  Scan Next Ticket
                </button>
              </div>
            )}
          </div>
          
          {/* Custom Styles for Html5-qrcode to override default ugly borders */}
          <style dangerouslySetInnerHTML={{__html: `
            #qr-reader { border: none !important; }
            #qr-reader__scan_region { background: transparent; }
            #qr-reader__dashboard_section_csr button { 
              background: #004b87; color: white; border: none; padding: 8px 16px; border-radius: 8px; margin-top: 10px; cursor: pointer;
            }
            #qr-reader__dashboard_section_csr span { color: white !important; }
            #qr-reader__camera_selection { background: #1a1a1a; color: white; padding: 8px; border-radius: 8px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.2); }
          `}} />
        </div>

        {/* Result Side */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-center">
          {error ? (
            <div className="text-center text-red-400 space-y-4">
              <XCircle size={64} className="mx-auto" />
              <h3 className="text-xl font-bold">Invalid Ticket</h3>
              <p className="text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>
            </div>
          ) : scanResult ? (
            <div className={`text-center space-y-4 ${scanResult.warning ? 'text-yellow-400' : 'text-green-400'}`}>
              {scanResult.warning ? (
                <AlertTriangle size={64} className="mx-auto" />
              ) : (
                <CheckCircle size={64} className="mx-auto" />
              )}
              <h3 className="text-2xl font-bold">
                {scanResult.warning ? 'Already Checked In' : 'Access Granted'}
              </h3>
              
              <div className="text-left bg-black/20 p-4 rounded-xl border border-white/10 mt-6 space-y-2 text-white">
                <p><span className="text-gray-400">Name:</span> <span className="font-bold text-lg">{scanResult.attendee.fullName}</span></p>
                <p><span className="text-gray-400">Reg ID:</span> <span className="font-mono text-[#00aeef]">{scanResult.attendee.registrationId}</span></p>
                <p><span className="text-gray-400">Category:</span> {scanResult.attendee.attendingAs}</p>
                <p><span className="text-gray-400">Seat:</span> {scanResult.attendee.seatId ? `Seat ${scanResult.attendee.seatId}` : 'Unassigned'}</p>
                <p><span className="text-gray-400">Payment:</span> {scanResult.attendee.paymentStatus}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 space-y-4">
              <Scan size={64} className="mx-auto opacity-50" />
              <h3 className="text-xl font-medium">Ready to Scan</h3>
              <p className="text-sm">Position the QR code inside the camera frame.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
