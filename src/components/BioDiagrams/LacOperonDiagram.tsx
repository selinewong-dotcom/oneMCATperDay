import React from 'react';
import { DiscreteOption } from '../../types/puzzle';
import { soundFX } from '../../utils/audio';

interface Props {
  userChoice: string;
  onChange: (id: string) => void;
  isRevealed: boolean;
  options: DiscreteOption[];
}

export const LacOperonDiagram: React.FC<Props> = ({
  userChoice,
  onChange,
  isRevealed,
  options,
}) => {
  const handleSelect = (id: string) => {
    if (isRevealed) return;
    onChange(id);
    soundFX.playClick();
  };

  return (
    <div className="w-full flex flex-col items-center select-none font-mono text-xs">
      {/* Lac Operon Genetic Schematic SVG */}
      <div className="w-full relative touch-none bg-navy-950/70 border border-slate-800 rounded-lg p-2.5 overflow-hidden">
        <svg viewBox="0 0 540 170" className="w-full h-auto overflow-visible">
          {/* DNA Double Helix Backbone representation */}
          <line x1="20" y1="85" x2="520" y2="85" stroke="#334155" strokeWidth="6" />

          {/* Gene 1: lacI (Mutated Repressor) */}
          <rect x="30" y="70" width="75" height="30" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="67" y="88" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">lacI gene</text>
          <text x="67" y="112" textAnchor="middle" fill="#f87171" fontSize="8" fontWeight="bold">Nonsense (Stop)</text>

          {/* Mutant Repressor Peptide Falling Apart */}
          <g transform="translate(67, 30)">
            <circle cx="-6" cy="0" r="5" fill="#f43f5e" />
            <circle cx="6" cy="0" r="4" fill="#f43f5e" opacity="0.6" />
            <text x="0" y="16" textAnchor="middle" fill="#fca5a5" fontSize="8">Truncated (No O-bind)</text>
          </g>

          {/* Promoter Region (P) & CAP site */}
          <rect x="135" y="70" width="60" height="30" rx="3" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="165" y="88" textAnchor="middle" fill="#e0f2fe" fontSize="10" fontWeight="bold">Promoter</text>

          {/* Operator Region (O) - VACANT */}
          <rect
            x="205"
            y="70"
            width="55"
            height="30"
            rx="3"
            fill={isRevealed ? '#14532d' : '#1e293b'}
            stroke={isRevealed ? '#a3e635' : '#e2e8f0'}
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />
          <text
            x="232"
            y="88"
            textAnchor="middle"
            fill={isRevealed ? '#bef264' : '#cbd5e1'}
            fontSize="10"
            fontWeight="bold"
          >
            Operator
          </text>
          <text x="232" y="112" textAnchor="middle" fill="#a3e635" fontSize="8">
            [UNBOUND / OPEN]
          </text>

          {/* Structural Genes: lacZ, lacY, lacA */}
          <rect x="270" y="70" width="85" height="30" rx="3" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
          <text x="312" y="88" textAnchor="middle" fill="#d1fae5" fontSize="10" fontWeight="bold">lacZ (β-gal)</text>

          <rect x="365" y="70" width="75" height="30" rx="3" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1.5" />
          <text x="402" y="88" textAnchor="middle" fill="#ccfbf1" fontSize="10" fontWeight="bold">lacY (Perm)</text>

          <rect x="450" y="70" width="65" height="30" rx="3" fill="#115e59" stroke="#14b8a6" strokeWidth="1.5" />
          <text x="482" y="88" textAnchor="middle" fill="#f0fdfa" fontSize="10" fontWeight="bold">lacA (Trans)</text>

          {/* RNA Polymerase Clearance Arrow */}
          <g transform="translate(165, 45)">
            <ellipse cx="0" cy="0" rx="18" ry="12" fill="#d97706" opacity="0.8" />
            <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">RNAP</text>
            <path d="M 20 0 L 290 0" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4,2" markerEnd="url(#arrow)" />
          </g>

          {/* Polycistronic mRNA Synthesis Stream */}
          <path
            d="M 270 135 C 320 145, 380 125, 515 135"
            fill="none"
            stroke="#a3e635"
            strokeWidth="2.5"
            strokeDasharray="3,3"
          />
          <text x="380" y="152" textAnchor="middle" fill="#bef264" fontSize="8" fontWeight="bold">
            Continuous Polycistronic mRNA Transcription (Constitutive)
          </text>
        </svg>
      </div>

      {/* Discrete Choice Buttons */}
      <div className="w-full mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = userChoice === opt.id;
          let btnStyle = 'border-slate-800 bg-navy-900/80 text-slate-300 hover:border-slate-700 hover:bg-navy-850';

          if (isRevealed) {
            if (opt.isCorrect) {
              btnStyle = 'border-retro-lime bg-retro-lime/10 text-retro-paleLime shadow-glow-green';
            } else if (isSelected && !opt.isCorrect) {
              btnStyle = 'border-rose-500 bg-rose-950/30 text-rose-300';
            } else {
              btnStyle = 'border-slate-800 bg-navy-950/50 text-slate-500 opacity-60';
            }
          } else if (isSelected) {
            btnStyle = 'border-retro-lime bg-retro-lime/20 text-white font-bold ring-1 ring-retro-lime';
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={isRevealed}
              className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${btnStyle}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs">{opt.label}</span>
                {isRevealed && opt.isCorrect && <span className="text-retro-lime font-bold">✓ Target</span>}
                {isRevealed && isSelected && !opt.isCorrect && <span className="text-rose-400 font-bold">✗ Selected</span>}
              </div>
              {opt.sublabel && (
                <span className="text-[10px] text-slate-400 mt-0.5">{opt.sublabel}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
