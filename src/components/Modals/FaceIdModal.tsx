import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface FaceIdModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  employeeName?: string;
  geofence?: string;
}

export const FaceIdModal: React.FC<FaceIdModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  employeeName = 'Tariq Al-Mansoor',
  geofence = 'HQ Floor 4 (Main Campus)',
}) => {
  const [step, setStep] = useState<'aligning' | 'scanning' | 'verifying' | 'verified'>('aligning');
  const [confidence, setConfidence] = useState(0);

  // Play subtle high-tech futuristic audio feedback via Web Audio API
  const playChime = (type: 'chirp' | 'success') => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'chirp') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else if (type === 'success') {
        // Dual chord: C5 + E5
        const now = ctx.currentTime;
        [523.25, 659.25, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.06, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.36);
        });
      }
    } catch {
      // Audio playback suppressed if blocked by browser policy
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setStep('aligning');
      setConfidence(0);
      return;
    }

    playChime('chirp');

    // Stage 1: Aligning
    const t1 = setTimeout(() => {
      setStep('scanning');
      setConfidence(48);
    }, 450);

    // Stage 2: Scanning
    const t2 = setTimeout(() => {
      setConfidence(86);
    }, 900);

    // Stage 3: Verifying
    const t3 = setTimeout(() => {
      setStep('verifying');
      setConfidence(99.8);
    }, 1350);

    // Stage 4: Verified
    const t4 = setTimeout(() => {
      setStep('verified');
      playChime('success');
      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#27c38a', '#6ffbbe', '#0058be', '#b6c4ff'],
        });
      } catch {
        // Ignore canvas errors
      }
    }, 1850);

    // Stage 5: Finish and callback
    const t5 = setTimeout(() => {
      onSuccess();
    }, 2450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070d16]/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-sm rounded-3xl bg-[#0b1320] border border-[#1e2e48] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center p-6 text-white text-center relative transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background effect */}
        <div className={`absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          step === 'verified' ? 'bg-[#27c38a]/30' : 'bg-[#0058be]/25'
        }`} />

        {/* Brand & Security Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-[#1e2e48]/80 mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1e3a8a] flex items-center justify-center text-[#6ffbbe]">
              <span className="material-symbols-outlined text-[16px]">vital_signs</span>
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="font-bold text-xs tracking-tight text-white">
                Pulse<span className="text-[#6ffbbe]">HR</span> Biometrics
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#94a3b8] font-mono">
                FIDO2 • Face ID Core v2.4
              </span>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="w-7 h-7 rounded-lg bg-[#18283f] hover:bg-[#1f324e] text-[#94a3b8] hover:text-white flex items-center justify-center transition-colors"
            title="Cancel Check-in"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Viewfinder Target & Portrait */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Outer Scanner Reticle Corners */}
          <div className="relative w-44 h-44 rounded-3xl p-3 flex items-center justify-center">
            {/* Top-Left Bracket */}
            <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-xl transition-all duration-300 ${
              step === 'verified' ? 'border-[#27c38a]' : 'border-[#0058be]'
            }`} />
            {/* Top-Right Bracket */}
            <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-xl transition-all duration-300 ${
              step === 'verified' ? 'border-[#27c38a]' : 'border-[#0058be]'
            }`} />
            {/* Bottom-Left Bracket */}
            <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-xl transition-all duration-300 ${
              step === 'verified' ? 'border-[#27c38a]' : 'border-[#0058be]'
            }`} />
            {/* Bottom-Right Bracket */}
            <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-xl transition-all duration-300 ${
              step === 'verified' ? 'border-[#27c38a]' : 'border-[#0058be]'
            }`} />

            {/* Radar Circular Pulse Ring */}
            <div className={`absolute inset-2 rounded-full border border-dashed transition-all duration-500 ${
              step === 'verified' ? 'border-[#27c38a]/60 animate-pulse' : 'border-[#0058be]/40 animate-radar'
            }`} />

            {/* Employee Portrait Target */}
            <div className="w-32 h-32 rounded-full overflow-hidden relative ring-4 ring-[#18283f] shadow-inner group">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=350"
                alt={employeeName}
                className="w-full h-full object-cover filter contrast-105"
              />

              {/* Laser Scanning Bar */}
              {step !== 'verified' && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#6ffbbe] to-transparent shadow-[0_0_12px_#6ffbbe] animate-scan-sweep pointer-events-none" />
              )}

              {/* Simulated Landmark Mesh Dots */}
              {step !== 'verified' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-20 h-20 grid grid-cols-3 gap-4 opacity-40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe] animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe] animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe] animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe] animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe] animate-ping" />
                  </div>
                </div>
              )}

              {/* Verified Overlay Shield */}
              {step === 'verified' && (
                <div className="absolute inset-0 bg-[#004a31]/80 backdrop-blur-xs flex items-center justify-center animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-[#27c38a] text-[#00236f] flex items-center justify-center shadow-lg transform scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[32px] font-bold">check</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Status Readout */}
        <div className="mt-3 space-y-1 relative z-10">
          <div className="flex items-center justify-center gap-1.5">
            {step === 'verified' ? (
              <span className="material-symbols-outlined text-[#27c38a] text-[20px]">verified</span>
            ) : (
              <span className="material-symbols-outlined text-[#6ffbbe] text-[20px] animate-spin">
                sync
              </span>
            )}
            <h3 className="text-base font-bold text-white tracking-tight">
              {step === 'aligning' && 'Aligning Facial Biometrics...'}
              {step === 'scanning' && '3D Depth Topology Analysis'}
              {step === 'verifying' && 'Cryptographic Token Verification'}
              {step === 'verified' && 'Identity Confirmed • Welcome!'}
            </h3>
          </div>

          <p className="text-xs text-[#94a3b8] max-w-xs mx-auto">
            {step === 'verified'
              ? `${employeeName} recognized at ${geofence}.`
              : 'Keep your face within the reticle to log shift check-in.'}
          </p>
        </div>

        {/* Telemetry Chips & Confidence Meter */}
        <div className="w-full mt-4 pt-3 border-t border-[#1e2e48]/80 space-y-2.5 text-xs relative z-10">
          {/* Confidence Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-[10px] text-[#94a3b8] mb-1 font-mono">
              <span>MATCH CONFIDENCE</span>
              <span className={confidence > 90 ? 'text-[#27c38a] font-bold' : 'text-[#6ffbbe]'}>
                {confidence.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#18283f] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  step === 'verified' ? 'bg-[#27c38a]' : 'bg-[#0058be]'
                }`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          {/* Hardware & Location Badges */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 rounded-xl bg-[#132238] border border-[#1e2e48] flex items-center gap-1.5 text-[#cbd5e1]">
              <span className="material-symbols-outlined text-[14px] text-[#6ffbbe]">wifi_tethering</span>
              <span className="truncate">HQ Beacon 02</span>
            </div>
            <div className="p-2 rounded-xl bg-[#132238] border border-[#1e2e48] flex items-center gap-1.5 text-[#cbd5e1]">
              <span className="material-symbols-outlined text-[14px] text-[#27c38a]">enhanced_encryption</span>
              <span className="truncate">AES-256 Validated</span>
            </div>
          </div>
        </div>

        {/* Cancel / Bypass CTA */}
        <div className="w-full mt-4">
          <button
            onClick={onCancel}
            type="button"
            className="w-full py-2 text-xs font-semibold text-[#94a3b8] hover:text-white transition-colors"
          >
            Cancel Authentication
          </button>
        </div>
      </div>
    </div>
  );
};
