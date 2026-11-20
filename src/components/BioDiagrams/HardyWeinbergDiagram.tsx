import React, { useRef, useState, useEffect, useCallback } from 'react';
import { soundFX } from '../../utils/audio';

interface Props {
  userValue: number;
  onChange: (val: number) => void;
  isRevealed: boolean;
  targetValue: number;
}

export const HardyWeinbergDiagram: React.FC<Props> = ({
  userValue,
  onChange,
  isRevealed,
  targetValue,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const minVal = 0.1;
  const maxVal = 5.0;

  const updateFromPointer = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawVal = minVal + pct * (maxVal - minVal);
    const stepped = Math.round(rawVal * 20) / 20; // step 0.05
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
        onChange(Math.max(minVal, Math.round((userValue - 0.05) * 20) / 20));
        soundFX.playDrag();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        onChange(Math.min(maxVal, Math.round((userValue + 0.05) * 20) / 20));
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
      {/* Hardy Weinberg Curve SVG */}
      <div className="w-full relative touch-none bg-navy-950/70 border border-slate-800 rounded-lg p-2.5 overflow-hidden">
        <svg viewBox="0 0 540 180" className="w-full h-auto overflow-visible">
          {/* Axes */}
          <line x1="50" y1="145" x2="490" y2="145" stroke="#cbd5e1" strokeWidth="1.2" />
          <line x1="50" y1="145" x2="50" y2="25" stroke="#cbd5e1" strokeWidth="1.2" />

          <text x="500" y="149" fill="#94a3b8" fontSize="9">q</text>
          <text x="45" y="20" textAnchor="end" fill="#94a3b8" fontSize="9">Frequency (%)</text>

          {/* Grid lines */}
          <line x1="50" y1="85" x2="490" y2="85" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
          <text x="42" y="88" textAnchor="end" fill="#64748b" fontSize="8">50%</text>

          {/* Curves: q from 0 to 1 */}
          {/* p^2 curve (starts at 100% at q=0, falls to 0 at q=1) */}
          <path
            d="M 50 25 C 200 35, 350 100, 490 145"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <text x="90" y="38" fill="#38bdf8" fontSize="8">p² (AA)</text>

          {/* 2pq parabola curve (0 at q=0, peaks at 50% at q=0.5, 0 at q=1) */}
          <path
            d="M 50 145 Q 270 25 490 145"
            fill="none"
            stroke="#a3e635"
            strokeWidth="2.5"
          />
          <text x="270" y="75" textAnchor="middle" fill="#bef264" fontSize="9" fontWeight="bold">
            2pq (Heterozygotes / Carriers)
          </text>

          {/* q^2 curve */}
          <path
            d="M 50 145 C 190 144, 340 120, 490 25"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <text x="460" y="45" fill="#f43f5e" fontSize="8">q² (aa)</text>

          {/* Zoom Inset for Rare Allele q = 0.01 */}
          <rect x="55" y="65" width="160" height="70" rx="4" fill="#091830" stroke="#0284c7" strokeWidth="1" />
          <text x="65" y="82" fill="#38bdf8" fontSize="9" fontWeight="bold">q² = 0.0001 (1 / 10,000)</text>
          <text x="65" y="98" fill="#93c5fd" fontSize="8">q = √0.0001 = 0.01 (1%)</text>
          <text x="65" y="112" fill="#93c5fd" fontSize="8">p = 1 - 0.01 = 0.99 (99%)</text>
          <text x="65" y="126" fill="#bef264" fontSize="8" fontWeight="bold">2pq = 2(0.99)(0.01) = ?</text>
        </svg>
      </div>

      {/* Interactive Carrier Frequency Slider */}
      <div className="w-full mt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Predicted Carrier Frequency (2pq):</span>
          <span className={`text-sm font-bold ${isRevealed ? 'text-retro-amber' : 'text-retro-lime'}`}>
            {userValue.toFixed(2)}%
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
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-retro-lime transition-all"
              style={{ width: `${userPct}%` }}
            />
          </div>

          {/* Markers */}
          <div className="absolute left-[0%] top-7 text-[9px] text-slate-500">0.1%</div>
          <div className="absolute left-[18.4%] top-7 text-[9px] text-slate-400 -translate-x-1/2">1.0%</div>
          <div className="absolute left-[38.4%] top-7 text-[9px] text-slate-400 -translate-x-1/2">
            2.0%
          </div>
          <div className="absolute left-[59.2%] top-7 text-[9px] text-slate-400 -translate-x-1/2">3.0%</div>
          <div className="absolute left-[79.6%] top-7 text-[9px] text-slate-400 -translate-x-1/2">4.0%</div>
          <div className="absolute right-[0%] top-7 text-[9px] text-slate-500">5.0%</div>

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
                Target: {targetValue.toFixed(2)}%
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
                {userValue.toFixed(2)}%
              </div>
            )}
          </div>
        </div>

        {!isRevealed && (
          <div className="mt-2 text-[11px] text-slate-400 flex justify-center items-center gap-1.5">
            <span className="text-retro-amber animate-pulse">◀ Slide or Arrow Keys ▶</span>
            <span>Heterozygotes are ~200× more prevalent than homozygotes</span>
          </div>
        )}
      </div>
    </div>
  );
};
