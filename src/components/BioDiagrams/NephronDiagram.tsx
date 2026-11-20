import React, { useRef, useState, useEffect, useCallback } from 'react';
import { soundFX } from '../../utils/audio';

interface Props {
  userValue: number;
  onChange: (val: number) => void;
  isRevealed: boolean;
  targetValue: number;
}

export const NephronDiagram: React.FC<Props> = ({
  userValue,
  onChange,
  isRevealed,
  targetValue,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const minVal = 100;
  const maxVal = 1400;

  const updateFromPointer = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawVal = minVal + pct * (maxVal - minVal);
    const stepped = Math.round(rawVal / 25) * 25;
    onChange(Math.max(minVal, Math.min(maxVal, stepped)));
  }, [onChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isRevealed) return;
    setIsDragging(true);
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updateFromPointer(e.clientX);
    soundFX.playDrag();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isRevealed) return;
    updateFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isRevealed) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        onChange(Math.max(minVal, userValue - 25));
        soundFX.playDrag();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        onChange(Math.min(maxVal, userValue + 25));
        soundFX.playDrag();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [userValue, isRevealed, onChange]);

  const userPct = ((userValue - minVal) / (maxVal - minVal)) * 100;
  const targetPct = ((targetValue - minVal) / (maxVal - minVal)) * 100;

  return (
    <div className="w-full flex flex-col items-center select-none font-mono text-xs">
      {/* Schematic SVG of Nephron with Corticomedullary Gradient */}
      <div className="w-full relative touch-none bg-navy-950/70 border border-slate-800 rounded-lg p-2 overflow-hidden">
        <svg viewBox="0 0 540 180" className="w-full h-auto overflow-visible">
          <defs>
            {/* Medullary gradient from cortex (top) to inner medulla (bottom) */}
            <linearGradient id="medullaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c2340" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#1e1b4b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#311042" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Background Gradient zones */}
          <rect x="10" y="10" width="520" height="160" rx="6" fill="url(#medullaGradient)" />

          {/* Depth Zone Dividers */}
          <line x1="10" y1="60" x2="530" y2="60" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="10" y1="120" x2="530" y2="120" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />

          {/* Zone Labels */}
          <text x="20" y="35" fill="#38bdf8" fontSize="10" fontWeight="bold">Renal Cortex (300 mOsm/L)</text>
          <text x="20" y="90" fill="#a855f7" fontSize="10" fontWeight="bold">Outer Medulla (600 mOsm/L)</text>
          <text x="20" y="150" fill="#ec4899" fontSize="10" fontWeight="bold">Inner Medulla (1200 mOsm/L)</text>

          {/* Glomerulus & Bowman's Capsule (Left) */}
          <circle cx="210" cy="35" r="12" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="210" cy="35" r="7" fill="#e11d48" opacity="0.8" />
          <text x="210" y="20" textAnchor="middle" fill="#94a3b8" fontSize="9">Glomerulus</text>

          {/* Proximal Convoluted Tubule (PCT) */}
          <path d="M 222 35 C 240 25, 250 45, 265 35" fill="none" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" />
          <text x="245" y="20" textAnchor="middle" fill="#60a5fa" fontSize="8">PCT (300)</text>

          {/* Loop of Henle: Descending & Ascending Limbs */}
          {/* Descending limb (permeable to H2O) */}
          <path d="M 265 35 L 265 145 C 265 160, 290 160, 290 145 L 290 35" fill="none" stroke="#818cf8" strokeWidth="4" />
          <text x="250" y="105" textAnchor="end" fill="#93c5fd" fontSize="8">H₂O out →</text>
          <text x="305" y="105" textAnchor="start" fill="#c084fc" fontSize="8">← Na⁺/K⁺/2Cl⁻ out</text>
          <text x="277" y="172" textAnchor="middle" fill="#ec4899" fontSize="8">1200</text>

          {/* Distal Convoluted Tubule (DCT) */}
          <path d="M 290 35 C 310 20, 330 45, 360 35" fill="none" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
          <text x="325" y="20" textAnchor="middle" fill="#a78bfa" fontSize="8">DCT (~100)</text>

          {/* Medullary Collecting Duct (Focal structure affected by ADH) */}
          <path d="M 360 35 L 360 165" fill="none" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
          <text x="375" y="45" fill="#38bdf8" fontSize="9" fontWeight="bold">Collecting Duct</text>

          {/* Aquaporin-2 Water Efflux Arrows (Stimulated by ADH) */}
          <g stroke="#38bdf8" strokeWidth="1.5" opacity="0.9">
            <path d="M 365 75 L 390 75 M 385 71 L 392 75 L 385 79" />
            <path d="M 365 105 L 390 105 M 385 101 L 392 105 L 385 109" />
            <path d="M 365 135 L 390 135 M 385 131 L 392 135 L 385 139" />
          </g>
          <text x="398" y="108" fill="#38bdf8" fontSize="8">AQP2 H₂O efflux (ADH)</text>

          {/* Urine Exit Droplet */}
          <path d="M 360 168 C 356 168, 354 175, 360 178 C 366 175, 364 168, 360 168 Z" fill="#bef264" />
          <text x="372" y="176" fill="#bef264" fontSize="9" fontWeight="bold">Urine</text>
        </svg>
      </div>

      {/* Interactive Osmolarity Slider Controller */}
      <div className="w-full mt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Excreted Urine Osmolarity:</span>
          <span className={`text-sm font-bold ${isRevealed ? 'text-retro-amber' : 'text-retro-lime'}`}>
            {Math.round(userValue)} mOsm/L
          </span>
        </div>

        {/* Custom Track with Target & Prediction Pins */}
        <div
          ref={containerRef}
          className="relative h-10 w-full flex items-center cursor-pointer touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Track Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-retro-lime transition-all"
              style={{ width: `${userPct}%` }}
            />
          </div>

          {/* Baseline Markers along scale */}
          <div className="absolute left-[0%] top-7 text-[9px] text-slate-500">100 (Dilute)</div>
          <div className="absolute left-[15.3%] top-7 text-[9px] text-slate-400 -translate-x-1/2">
            300 (Isotonic)
          </div>
          <div className="absolute left-[38.4%] top-7 text-[9px] text-slate-400 -translate-x-1/2">
            600 (Medulla)
          </div>
          <div className="absolute left-[84.6%] top-7 text-[9px] text-slate-400 -translate-x-1/2">
            1200 (Deep Medulla)
          </div>
          <div className="absolute right-[0%] top-7 text-[9px] text-slate-500">1400</div>

          {/* Revealed Target Pin */}
          {isRevealed && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none"
              style={{ left: `${targetPct}%` }}
            >
              <div className="w-4 h-7 bg-retro-lime border-2 border-slate-900 rounded flex items-center justify-center shadow-glow-green">
                <span className="w-1.5 h-1.5 bg-navy-950 rounded-full" />
              </div>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-retro-lime text-navy-950 font-bold px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap shadow">
                Target: {targetValue}
              </div>
            </div>
          )}

          {/* User Slider Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 transition-transform active:scale-110"
            style={{ left: `${userPct}%` }}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg ${
                isRevealed ? 'bg-amber-400' : 'bg-retro-lime'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-slate-900" />
            </div>
            {!isRevealed && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-300 bg-slate-900/90 px-1 rounded border border-slate-700 whitespace-nowrap">
                {userValue}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        {!isRevealed && (
          <div className="mt-2 text-[11px] text-slate-400 flex justify-center items-center gap-1.5">
            <span className="text-retro-amber animate-pulse">◀ Slide or Arrow Keys ▶</span>
            <span>Predict medullary collecting duct equilibration value</span>
          </div>
        )}
      </div>
    </div>
  );
};
