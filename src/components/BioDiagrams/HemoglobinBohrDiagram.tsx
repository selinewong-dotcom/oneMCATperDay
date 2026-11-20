import React, { useRef, useState, useEffect, useCallback } from 'react';
import { soundFX } from '../../utils/audio';

interface Props {
  userValue: number;
  onChange: (val: number) => void;
  isRevealed: boolean;
  targetValue: number;
}

export const HemoglobinBohrDiagram: React.FC<Props> = ({
  userValue,
  onChange,
  isRevealed,
  targetValue,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const minVal = 15.0;
  const maxVal = 50.0;
  const baselineP50 = 26.6;

  // ViewBox: 0 0 540 260
  // X: 60 to 490 (PO2 0 to 100 mmHg)
  // Y: 220 to 35 (SaO2 0 to 100%)
  const xOrigin = 60;
  const xEnd = 490;
  const yOrigin = 220;
  const yTop = 35;
  const pMax = 100.0;

  const valToX = (p: number) => xOrigin + (p / pMax) * (xEnd - xOrigin);
  const xToVal = (x: number) => Math.max(minVal, Math.min(maxVal, ((x - xOrigin) / (xEnd - xOrigin)) * pMax));
  const satToY = (sat: number) => yOrigin - (sat / 100) * (yOrigin - yTop);

  // Sigmoidal Hill equation: Sat = (PO2^2.8) / (P50^2.8 + PO2^2.8) * 100
  const generateSigmoid = (p50: number) => {
    const n = 2.8;
    const p50_n = Math.pow(p50, n);
    const points: string[] = [];
    for (let p = 0; p <= pMax; p += 1) {
      const p_n = Math.pow(p, n);
      const sat = (p_n / (p50_n + p_n)) * 100;
      const x = valToX(p);
      const y = satToY(sat);
      points.push(`${p === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  const baselineCurve = generateSigmoid(baselineP50);
  const currentCurve = generateSigmoid(userValue);
  const targetCurve = generateSigmoid(targetValue);

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
    const stepped = Math.round(rawVal * 2) / 2; // step 0.5
    onChange(Math.max(minVal, Math.min(maxVal, stepped)));
  }, [onChange]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isRevealed) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        onChange(Math.max(minVal, Math.round((userValue - 0.5) * 2) / 2));
        soundFX.playDrag();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        onChange(Math.min(maxVal, Math.round((userValue + 0.5) * 2) / 2));
        soundFX.playDrag();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [userValue, isRevealed, onChange]);

  const userMarkerX = valToX(userValue);
  const targetMarkerX = valToX(targetValue);
  const baselineMarkerX = valToX(baselineP50);
  const halfSatY = satToY(50);

  return (
    <div className="w-full flex flex-col items-center select-none font-mono text-xs">
      <div className="w-full relative touch-none">
        <svg
          ref={svgRef}
          viewBox="0 0 540 260"
          className="w-full h-auto overflow-visible cursor-ew-resize"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Background Grid */}
          <g stroke="#172554" strokeWidth="0.8" strokeDasharray="3,3">
            {[20, 40, 60, 80].map((p) => (
              <line key={`gx-${p}`} x1={valToX(p)} y1={yTop} x2={valToX(p)} y2={yOrigin} />
            ))}
            {[25, 50, 75, 100].map((s) => (
              <line key={`gy-${s}`} x1={xOrigin} y1={satToY(s)} x2={xEnd} y2={satToY(s)} />
            ))}
          </g>

          {/* 50% Saturation Reference Line */}
          <line
            x1={xOrigin}
            y1={halfSatY}
            x2={xEnd}
            y2={halfSatY}
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4,4"
            opacity="0.6"
          />
          <text x={xOrigin - 8} y={halfSatY + 4} textAnchor="end" fill="#94a3b8" fontSize="10">
            50% SaO₂
          </text>

          {/* Axes */}
          <line x1={xOrigin} y1={yOrigin} x2={xEnd + 15} y2={yOrigin} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={xOrigin} y1={yOrigin} x2={xOrigin} y2={yTop - 10} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Axis Labels */}
          <text x={xEnd + 18} y={yOrigin + 4} fill="#cbd5e1" fontSize="10" fontWeight="bold">
            PO₂ (mmHg)
          </text>
          <text x={xOrigin - 10} y={yTop - 12} fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="end">
            SaO₂ (%)
          </text>

          {/* PO2 tick marks */}
          {[0, 20, 40, 60, 80, 100].map((p) => (
            <g key={`tick-${p}`}>
              <line x1={valToX(p)} y1={yOrigin} x2={valToX(p)} y2={yOrigin + 5} stroke="#cbd5e1" strokeWidth="1.2" />
              <text x={valToX(p)} y={yOrigin + 17} textAnchor="middle" fill="#94a3b8" fontSize="10">
                {p}
              </text>
            </g>
          ))}

          {/* Baseline Curve (Normal pH 7.4) */}
          <path d={baselineCurve} fill="none" stroke="#38bdf8" strokeWidth="2.5" opacity="0.75" />
          <text x={valToX(60)} y={satToY(92)} fill="#38bdf8" fontSize="10" fontWeight="bold">
            Normal (P50 = 26.6)
          </text>
          <circle cx={baselineMarkerX} cy={halfSatY} r="3.5" fill="#38bdf8" />

          {/* Target Curve when Revealed */}
          {isRevealed && (
            <path d={targetCurve} fill="none" stroke="#a3e635" strokeWidth="2.5" />
          )}

          {isRevealed && (
            <g>
              <line
                x1={targetMarkerX}
                y1={halfSatY}
                x2={targetMarkerX}
                y2={yOrigin}
                stroke="#a3e635"
                strokeWidth="2"
                strokeDasharray="2,2"
              />
              <circle cx={targetMarkerX} cy={halfSatY} r="5" fill="#a3e635" />
              <rect x={targetMarkerX - 44} y={yOrigin + 22} width="88" height="20" rx="3" fill="#14532d" stroke="#a3e635" strokeWidth="1" />
              <text x={targetMarkerX} y={yOrigin + 36} textAnchor="middle" fill="#bef264" fontSize="10" fontWeight="bold">
                Target: {targetValue.toFixed(1)} mmHg
              </text>
            </g>
          )}

          {/* Candidate Curve */}
          {!isRevealed && (
            <path d={currentCurve} fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4,2" />
          )}

          {/* User's Draggable P50 Marker */}
          <g className="cursor-ew-resize">
            <line
              x1={userMarkerX}
              y1={halfSatY}
              x2={userMarkerX}
              y2={yOrigin}
              stroke={isRevealed ? '#fbbf24' : '#f59e0b'}
              strokeWidth={isDragging ? '2.5' : '1.8'}
              strokeDasharray={isRevealed ? '3,3' : 'none'}
            />
            <circle
              cx={userMarkerX}
              cy={halfSatY}
              r={isDragging ? '7' : '5.5'}
              fill={isRevealed ? '#fbbf24' : '#f59e0b'}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <polygon
              points={`${userMarkerX - 6},${yOrigin + 2} ${userMarkerX + 6},${yOrigin + 2} ${userMarkerX},${yOrigin - 6}`}
              fill={isRevealed ? '#fbbf24' : '#f59e0b'}
            />
            <rect
              x={userMarkerX - 38}
              y={halfSatY - 32}
              width="76"
              height="20"
              rx="3"
              fill="#0f172a"
              stroke={isRevealed ? '#fbbf24' : '#f59e0b'}
              strokeWidth="1.2"
            />
            <text
              x={userMarkerX}
              y={halfSatY - 18}
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="10"
              fontWeight="bold"
            >
              {isRevealed ? `You: ${userValue.toFixed(1)}` : `${userValue.toFixed(1)} mmHg`}
            </text>
          </g>
        </svg>
      </div>

      {!isRevealed && (
        <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <span className="text-retro-amber animate-pulse">◀ Drag marker ▶</span>
          <span>Acidosis & heat shift curve rightward (CADET face right)</span>
        </div>
      )}
    </div>
  );
};
