import React, { useRef, useState, useEffect, useCallback } from 'react';
import { soundFX } from '../../utils/audio';

interface Props {
  userValue: number;
  onChange: (val: number) => void;
  isRevealed: boolean;
  targetValue: number;
}

export const MichaelisMentenDiagram: React.FC<Props> = ({
  userValue,
  onChange,
  isRevealed,
  targetValue,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const minVal = 1.0;
  const maxVal = 16.0;
  const baselineKm = 4.0;
  const Vmax = 100;

  // Coordinate mapping for SVG (ViewBox: 0 0 540 260)
  // X: 60 to 490 (Substrate 0 to 20 mM)
  // Y: 220 to 30 (Velocity 0 to 110%)
  const xOrigin = 60;
  const xEnd = 490;
  const yOrigin = 220;
  const yTop = 35;
  const sMax = 20.0;

  const valToX = (s: number) => xOrigin + (s / sMax) * (xEnd - xOrigin);
  const xToVal = (x: number) => Math.max(minVal, Math.min(maxVal, ((x - xOrigin) / (xEnd - xOrigin)) * sMax));
  const vToY = (v: number) => yOrigin - (v / 110) * (yOrigin - yTop);

  // Generate Michaelis-Menten curve path: V = (Vmax * S) / (Km + S)
  const generateCurve = (km: number) => {
    const points: string[] = [];
    for (let s = 0; s <= sMax; s += 0.5) {
      const v = (Vmax * s) / (km + s);
      const x = valToX(s);
      const y = vToY(v);
      points.push(`${s === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  const baselineCurve = generateCurve(baselineKm);
  const currentInhibitedCurve = generateCurve(userValue);
  const targetInhibitedCurve = generateCurve(targetValue);

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

  const updateFromPointer = useCallback((clientX: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scale = 540 / rect.width;
    const svgX = (clientX - rect.left) * scale;
    const rawVal = xToVal(svgX);
    const stepped = Math.round(rawVal * 5) / 5; // step 0.2
    onChange(Math.max(minVal, Math.min(maxVal, stepped)));
  }, [onChange]);

  // Keyboard accessibility
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isRevealed) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        onChange(Math.max(minVal, Math.round((userValue - 0.2) * 5) / 5));
        soundFX.playDrag();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        onChange(Math.min(maxVal, Math.round((userValue + 0.2) * 5) / 5));
        soundFX.playDrag();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [userValue, isRevealed, onChange]);

  const userMarkerX = valToX(userValue);
  const targetMarkerX = valToX(targetValue);
  const baselineMarkerX = valToX(baselineKm);
  const halfVmaxY = vToY(50);

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="w-full relative touch-none">
        <svg
          ref={svgRef}
          viewBox="0 0 540 260"
          className="w-full h-auto overflow-visible cursor-ew-resize font-mono text-xs"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <defs>
            {/* Subtle glow filter for pixel neon lines */}
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="inhibitedGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="targetGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#bef264" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <g stroke="#172554" strokeWidth="0.8" strokeDasharray="3,3">
            {[2, 4, 6, 8, 10, 12, 14, 16, 18].map((s) => (
              <line key={`gx-${s}`} x1={valToX(s)} y1={yTop} x2={valToX(s)} y2={yOrigin} />
            ))}
            {[25, 50, 75, 100].map((v) => (
              <line key={`gy-${v}`} x1={xOrigin} y1={vToY(v)} x2={xEnd} y2={vToY(v)} />
            ))}
          </g>

          {/* Vmax / 2 reference line */}
          <line
            x1={xOrigin}
            y1={halfVmaxY}
            x2={xEnd}
            y2={halfVmaxY}
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4,4"
            opacity="0.6"
          />
          <text x={xOrigin - 8} y={halfVmaxY + 4} textAnchor="end" fill="#94a3b8" fontSize="10">
            ½ Vmax
          </text>

          {/* Vmax asymptote line */}
          <line
            x1={xOrigin}
            y1={vToY(100)}
            x2={xEnd}
            y2={vToY(100)}
            stroke="#64748b"
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity="0.4"
          />
          <text x={xOrigin - 8} y={vToY(100) + 4} textAnchor="end" fill="#64748b" fontSize="10">
            Vmax
          </text>

          {/* Axes */}
          <line x1={xOrigin} y1={yOrigin} x2={xEnd + 15} y2={yOrigin} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={xOrigin} y1={yOrigin} x2={xOrigin} y2={yTop - 10} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Axis Labels */}
          <text x={xEnd + 18} y={yOrigin + 4} fill="#cbd5e1" fontSize="10" fontWeight="bold">
            [S] (mM)
          </text>
          <text x={xOrigin - 10} y={yTop - 12} fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="end">
            Velocity (V)
          </text>

          {/* Substrate tick marks */}
          {[0, 4, 8, 12, 16, 20].map((s) => (
            <g key={`tick-${s}`}>
              <line x1={valToX(s)} y1={yOrigin} x2={valToX(s)} y2={yOrigin + 5} stroke="#cbd5e1" strokeWidth="1.2" />
              <text x={valToX(s)} y={yOrigin + 17} textAnchor="middle" fill="#94a3b8" fontSize="10">
                {s}
              </text>
            </g>
          ))}

          {/* 1. Control Curve (Uninhibited) */}
          <path d={baselineCurve} fill="none" stroke="url(#curveGradient)" strokeWidth="2.5" opacity="0.8" />
          <text x={valToX(14)} y={vToY(74)} fill="#38bdf8" fontSize="10" fontWeight="bold">
            Control (Km = 4.0)
          </text>

          {/* Baseline Km indicator */}
          <line
            x1={baselineMarkerX}
            y1={halfVmaxY}
            x2={baselineMarkerX}
            y2={yOrigin}
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="3,3"
          />
          <circle cx={baselineMarkerX} cy={halfVmaxY} r="3.5" fill="#38bdf8" />

          {/* 2. Target Curve (Revealed Mode) */}
          {isRevealed && (
            <path
              d={targetInhibitedCurve}
              fill="none"
              stroke="url(#targetGradient)"
              strokeWidth="2.5"
              filter="url(#neon-glow)"
            />
          )}

          {/* Target marker indicator when revealed */}
          {isRevealed && (
            <g>
              <line
                x1={targetMarkerX}
                y1={halfVmaxY}
                x2={targetMarkerX}
                y2={yOrigin}
                stroke="#a3e635"
                strokeWidth="2"
                strokeDasharray="2,2"
              />
              <circle cx={targetMarkerX} cy={halfVmaxY} r="5" fill="#a3e635" />
              {/* Target pill */}
              <rect x={targetMarkerX - 44} y={yOrigin + 22} width="88" height="20" rx="3" fill="#14532d" stroke="#a3e635" strokeWidth="1" />
              <text x={targetMarkerX} y={yOrigin + 36} textAnchor="middle" fill="#bef264" fontSize="10" fontWeight="bold">
                Target: {targetValue.toFixed(1)} mM
              </text>
            </g>
          )}

          {/* 3. Candidate / User Predicted Curve */}
          {!isRevealed && (
            <path
              d={currentInhibitedCurve}
              fill="none"
              stroke="url(#inhibitedGradient)"
              strokeWidth="2.5"
              strokeDasharray="4,2"
            />
          )}

          {/* User's interactive draggable Km marker */}
          <g className="cursor-ew-resize">
            {/* Vertical connector line */}
            <line
              x1={userMarkerX}
              y1={halfVmaxY}
              x2={userMarkerX}
              y2={yOrigin}
              stroke={isRevealed ? '#fbbf24' : '#f59e0b'}
              strokeWidth={isDragging ? '2.5' : '1.8'}
              strokeDasharray={isRevealed ? '3,3' : 'none'}
            />
            {/* Draggable handle at ½ Vmax */}
            <circle
              cx={userMarkerX}
              cy={halfVmaxY}
              r={isDragging ? '7' : '5.5'}
              fill={isRevealed ? '#fbbf24' : '#f59e0b'}
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all"
            />

            {/* Draggable slider handle on the axis */}
            <polygon
              points={`${userMarkerX - 6},${yOrigin + 2} ${userMarkerX + 6},${yOrigin + 2} ${userMarkerX},${yOrigin - 6}`}
              fill={isRevealed ? '#fbbf24' : '#f59e0b'}
            />

            {/* Live readout badge above marker */}
            <rect
              x={userMarkerX - 38}
              y={halfVmaxY - 32}
              width="76"
              height="20"
              rx="3"
              fill="#0f172a"
              stroke={isRevealed ? '#fbbf24' : '#f59e0b'}
              strokeWidth="1.2"
            />
            <text
              x={userMarkerX}
              y={halfVmaxY - 18}
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="10"
              fontWeight="bold"
            >
              {isRevealed ? `You: ${userValue.toFixed(1)}` : `${userValue.toFixed(1)} mM`}
            </text>
          </g>
        </svg>
      </div>

      {/* Helper drag guide indicator during prediction phase */}
      {!isRevealed && (
        <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <span className="text-retro-amber animate-pulse">◀ Drag marker ▶</span>
          <span>Set the shifted Km along the substrate axis</span>
        </div>
      )}
    </div>
  );
};
