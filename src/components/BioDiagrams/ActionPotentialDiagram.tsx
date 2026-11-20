import React, { useRef, useState, useEffect, useCallback } from 'react';
import { soundFX } from '../../utils/audio';

interface Props {
  userValue: number;
  onChange: (val: number) => void;
  isRevealed: boolean;
  targetValue: number;
}

export const ActionPotentialDiagram: React.FC<Props> = ({
  userValue,
  onChange,
  isRevealed,
  targetValue,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const minVal = -95;
  const maxVal = -30;

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
      {/* Oscilloscope & Membrane Biophysics SVG */}
      <div className="w-full relative touch-none bg-navy-950/70 border border-slate-800 rounded-lg p-2.5 overflow-hidden">
        <svg viewBox="0 0 540 180" className="w-full h-auto overflow-visible">
          {/* Oscilloscope Grid */}
          <rect x="15" y="15" width="240" height="150" rx="4" fill="#030c1b" stroke="#1e293b" strokeWidth="1" />
          <g stroke="#0f2648" strokeWidth="0.8" strokeDasharray="3,3">
            {[45, 75, 105, 135].map(y => (
              <line key={`oy-${y}`} x1="15" y1={y} x2="255" y2={y} />
            ))}
            {[60, 105, 150, 195].map(x => (
              <line key={`ox-${x}`} x1={x} y1="15" x2={x} y2="165" />
            ))}
          </g>

          {/* Oscilloscope Traces */}
          {/* Baseline -70 mV trace */}
          <line x1="25" y1="115" x2="105" y2="115" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2,2" />
          <text x="30" y="110" fill="#38bdf8" fontSize="8">Baseline (-70 mV)</text>

          {/* Threshold line (-55 mV) */}
          <line x1="25" y1="85" x2="245" y2="85" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" />
          <text x="245" y="80" textAnchor="end" fill="#f87171" fontSize="8">Threshold (-55 mV)</text>

          {/* Dynamic shift curve based on user input */}
          <path
            d={`M 105 115 C 130 115, 140 ${165 - ((userValue + 95) / 65) * 110}, 165 ${165 - ((userValue + 95) / 65) * 110} L 245 ${165 - ((userValue + 95) / 65) * 110}`}
            fill="none"
            stroke={isRevealed ? '#fbbf24' : '#bef264'}
            strokeWidth="2.5"
          />
          <text
            x="240"
            y={Math.max(25, 160 - ((userValue + 95) / 65) * 110)}
            textAnchor="end"
            fill={isRevealed ? '#fbbf24' : '#bef264'}
            fontSize="9"
            fontWeight="bold"
          >
            Vm = {userValue} mV
          </text>

          {/* Right Panel: Lipid Bilayer & K+ leak channels */}
          <rect x="270" y="15" width="255" height="150" rx="4" fill="#091428" stroke="#1e293b" strokeWidth="1" />
          <text x="280" y="32" fill="#94a3b8" fontSize="9" fontWeight="bold">EXTRACELLULAR ([K⁺] = 8.0 mM)</text>

          {/* Lipid Bilayer */}
          <rect x="270" y="65" width="255" height="24" fill="#1e293b" />
          {/* Membrane heads */}
          {[...Array(16)].map((_, i) => (
            <circle key={`mh-top-${i}`} cx={280 + i * 16} cy="68" r="3.5" fill="#f59e0b" opacity="0.8" />
          ))}
          {[...Array(16)].map((_, i) => (
            <circle key={`mh-bot-${i}`} cx={280 + i * 16} cy="86" r="3.5" fill="#f59e0b" opacity="0.8" />
          ))}

          {/* K+ leak channel pore */}
          <rect x="365" y="60" width="30" height="34" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="380" y="80" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">K⁺ leak</text>

          <text x="280" y="115" fill="#94a3b8" fontSize="9" fontWeight="bold">INTRACELLULAR ([K⁺] = 140 mM)</text>

          {/* Nernst Formula Insight */}
          <rect x="280" y="130" width="235" height="28" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="397" y="148" textAnchor="middle" fill="#38bdf8" fontSize="9">
            EK = 61.5 · log₁₀(8 / 140) ≈ -76 mV
          </text>
        </svg>
      </div>

      {/* Interactive Voltage Slider */}
      <div className="w-full mt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Predicted Depolarized Membrane Potential (Vm):</span>
          <span className={`text-sm font-bold ${isRevealed ? 'text-retro-amber' : 'text-retro-lime'}`}>
            {userValue} mV
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
              className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 transition-all"
              style={{ width: `${userPct}%` }}
            />
          </div>

          {/* Key Reference Markers */}
          <div className="absolute left-[7.7%] top-7 text-[9px] text-slate-500 -translate-x-1/2">
            -90 (EK)
          </div>
          <div className="absolute left-[38.5%] top-7 text-[9px] text-sky-400 -translate-x-1/2">
            -70 (Resting)
          </div>
          <div className="absolute left-[61.5%] top-7 text-[9px] text-rose-400 -translate-x-1/2">
            -55 (Threshold)
          </div>
          <div className="absolute right-[0%] top-7 text-[9px] text-slate-500">
            -30
          </div>

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
                Target: {targetValue} mV
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
                {userValue} mV
              </div>
            )}
          </div>
        </div>

        {!isRevealed && (
          <div className="mt-2 text-[11px] text-slate-400 flex justify-center items-center gap-1.5">
            <span className="text-retro-amber animate-pulse">◀ Slide or Arrow Keys ▶</span>
            <span>Reduced outward chemical gradient depolarizes resting Vm</span>
          </div>
        )}
      </div>
    </div>
  );
};
