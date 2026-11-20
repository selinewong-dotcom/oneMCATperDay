import React, { useRef, useState, useEffect, useCallback } from 'react';
import { soundFX } from '../../utils/audio';

interface Props {
  userValue: number;
  onChange: (val: number) => void;
  isRevealed: boolean;
  targetValue: number;
}

export const MetabolicFluxDiagram: React.FC<Props> = ({
  userValue,
  onChange,
  isRevealed,
  targetValue,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const minVal = 24;
  const maxVal = 38;

  const updateFromPointer = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawVal = minVal + pct * (maxVal - minVal);
    const stepped = Math.round(rawVal);
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
        onChange(Math.max(minVal, userValue - 1));
        soundFX.playDrag();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        onChange(Math.min(maxVal, userValue + 1));
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
      {/* Cellular Respiration & Electron Shuttle Schematic */}
      <div className="w-full relative touch-none bg-navy-950/70 border border-slate-800 rounded-lg p-2.5 overflow-hidden">
        <svg viewBox="0 0 540 180" className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="mitoGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Cytosol vs Mitochondria Boundary */}
          <rect x="15" y="15" width="220" height="150" rx="6" fill="#0c1830" stroke="#1e3a8a" strokeWidth="1" />
          <text x="25" y="32" fill="#60a5fa" fontSize="10" fontWeight="bold">CYTOSOL</text>

          <rect x="250" y="15" width="275" height="150" rx="6" fill="url(#mitoGrad)" stroke="#b45309" strokeWidth="1" />
          <text x="260" y="32" fill="#f59e0b" fontSize="10" fontWeight="bold">MITOCHONDRIAL MATRIX & ETC</text>

          {/* Glycolysis Box */}
          <rect x="25" y="50" width="100" height="42" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
          <text x="75" y="66" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">Glucose (6C)</text>
          <text x="75" y="80" textAnchor="middle" fill="#93c5fd" fontSize="8">→ 2 Pyruvate + 2 ATP</text>

          {/* Cytosolic NADH bubble */}
          <rect x="140" y="55" width="85" height="32" rx="4" fill="#042f2e" stroke="#14b8a6" strokeWidth="1" />
          <text x="182" y="70" textAnchor="middle" fill="#2dd4bf" fontSize="8" fontWeight="bold">2 Cytosolic NADH</text>
          <text x="182" y="81" textAnchor="middle" fill="#99f6e4" fontSize="7">(Cannot cross IMM)</text>

          {/* Shuttle Branch 1: Malate-Aspartate (Standard Heart/Liver) */}
          <path d="M 225 65 L 260 65 L 290 65" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
          <rect x="270" y="52" width="115" height="26" rx="3" fill="#1e293b" stroke="#64748b" strokeWidth="1" opacity="0.7" />
          <text x="327" y="64" textAnchor="middle" fill="#cbd5e1" fontSize="8">Malate-Aspartate Shuttle</text>
          <text x="327" y="74" textAnchor="middle" fill="#94a3b8" fontSize="7">→ NADH (Complex I) = 32 ATP</text>

          {/* Shuttle Branch 2: Glycerol-3-Phosphate (Skeletal Muscle & Brain) - ACTIVE IN PUZZLE */}
          <path d="M 182 87 L 182 125 L 270 125" fill="none" stroke="#a3e635" strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="270" y="105" width="135" height="38" rx="4" fill="#14532d" stroke="#a3e635" strokeWidth="1.5" />
          <text x="337" y="120" textAnchor="middle" fill="#bef264" fontSize="9" fontWeight="bold">Glycerol-3-P Shuttle</text>
          <text x="337" y="133" textAnchor="middle" fill="#86efac" fontSize="8">→ FADH₂ (Complex II entry!)</text>

          {/* Complex II & ATP synthase yield badge */}
          <rect x="420" y="105" width="95" height="38" rx="4" fill="#312e81" stroke="#818cf8" strokeWidth="1" />
          <text x="467" y="120" textAnchor="middle" fill="#c7d2fe" fontSize="8" fontWeight="bold">ATP Cost</text>
          <text x="467" y="133" textAnchor="middle" fill="#e0e7ff" fontSize="8">1.5 ATP/NADH (–2 ATP)</text>
        </svg>
      </div>

      {/* Interactive ATP Slider */}
      <div className="w-full mt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Predicted Net ATP per Glucose:</span>
          <span className={`text-sm font-bold ${isRevealed ? 'text-retro-amber' : 'text-retro-lime'}`}>
            {userValue} ATP
          </span>
        </div>

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
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-retro-lime transition-all"
              style={{ width: `${userPct}%` }}
            />
          </div>

          {/* Baseline Markers */}
          <div className="absolute left-[0%] top-7 text-[9px] text-slate-500">24</div>
          <div className="absolute left-[28.5%] top-7 text-[9px] text-slate-500 -translate-x-1/2">28</div>
          <div className="absolute left-[57.1%] top-7 text-[9px] text-slate-400 -translate-x-1/2">
            32 (Malate-Aspartate)
          </div>
          <div className="absolute left-[85.7%] top-7 text-[9px] text-slate-500 -translate-x-1/2">36</div>
          <div className="absolute right-[0%] top-7 text-[9px] text-slate-500">38</div>

          {/* Target Flag when Revealed */}
          {isRevealed && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none"
              style={{ left: `${targetPct}%` }}
            >
              <div className="w-4 h-7 bg-retro-lime border-2 border-slate-900 rounded flex items-center justify-center shadow-glow-green">
                <span className="w-1.5 h-1.5 bg-navy-950 rounded-full" />
              </div>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-retro-lime text-navy-950 font-bold px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap shadow">
                Target: {targetValue} ATP
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
                {userValue} ATP
              </div>
            )}
          </div>
        </div>

        {!isRevealed && (
          <div className="mt-2 text-[11px] text-slate-400 flex justify-center items-center gap-1.5">
            <span className="text-retro-amber animate-pulse">◀ Slide or Arrow Keys ▶</span>
            <span>Account for FADH₂ entering Complex II instead of Complex I</span>
          </div>
        )}
      </div>
    </div>
  );
};
