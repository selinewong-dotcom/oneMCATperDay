import React from 'react';
import { DiscreteOption } from '../../types/puzzle';
import { soundFX } from '../../utils/audio';

interface Props {
  userChoice: string;
  onChange: (id: string) => void;
  isRevealed: boolean;
  options: DiscreteOption[];
}

export const CellCycleDiagram: React.FC<Props> = ({
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
      {/* Cell Cycle Wheel & Molecular Checkpoint Cascade */}
      <div className="w-full relative touch-none bg-navy-950/70 border border-slate-800 rounded-lg p-2.5 overflow-hidden">
        <svg viewBox="0 0 540 170" className="w-full h-auto overflow-visible">
          {/* Cell Cycle Wheel (Left) */}
          <g transform="translate(110, 85)">
            {/* G1 Arc */}
            <path
              d="M 0 -60 A 60 60 0 0 1 60 0 L 40 0 A 40 40 0 0 0 0 -40 Z"
              fill="#0284c7"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <text x="32" y="-25" fill="#e0f2fe" fontSize="9" fontWeight="bold">G1</text>

            {/* Restriction Point Blockade */}
            <rect x="52" y="-10" width="16" height="20" rx="2" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
            <text x="60" y="4" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">🛑</text>

            {/* S Phase Arc */}
            <path
              d="M 60 0 A 60 60 0 0 1 0 60 L 0 40 A 40 40 0 0 0 40 0 Z"
              fill="#0f766e"
              stroke="#2dd4bf"
              strokeWidth="1"
            />
            <text x="25" y="32" fill="#ccfbf1" fontSize="9" fontWeight="bold">S</text>

            {/* G2 Arc */}
            <path
              d="M 0 60 A 60 60 0 0 1 -60 0 L -40 0 A 40 40 0 0 0 0 40 Z"
              fill="#4338ca"
              stroke="#818cf8"
              strokeWidth="1"
            />
            <text x="-32" y="25" fill="#e0e7ff" fontSize="9" fontWeight="bold">G2</text>

            {/* M Phase Arc */}
            <path
              d="M -60 0 A 60 60 0 0 1 0 -60 L 0 -40 A 40 40 0 0 0 -40 0 Z"
              fill="#b91c1c"
              stroke="#f87171"
              strokeWidth="1"
            />
            <text x="-25" y="-25" fill="#fee2e2" fontSize="9" fontWeight="bold">M</text>

            <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="8">R-Point</text>
          </g>

          {/* Molecular Pathway Flowchart (Right) */}
          <rect x="230" y="15" width="295" height="140" rx="4" fill="#09152b" stroke="#1e293b" strokeWidth="1" />
          <text x="240" y="32" fill="#94a3b8" fontSize="9" fontWeight="bold">DNA DAMAGE CHECKPOINT CASCADE</text>

          {/* Step 1: DSB -> ATM */}
          <rect x="240" y="45" width="75" height="26" rx="3" fill="#312e81" stroke="#818cf8" strokeWidth="1" />
          <text x="277" y="61" textAnchor="middle" fill="#c7d2fe" fontSize="8">DNA DSBs → ATM</text>

          {/* Arrow */}
          <path d="M 315 58 L 335 58" stroke="#818cf8" strokeWidth="1.5" />

          {/* Step 2: p53 stabilization */}
          <rect x="335" y="45" width="65" height="26" rx="3" fill="#065f46" stroke="#34d399" strokeWidth="1" />
          <text x="367" y="61" textAnchor="middle" fill="#6ee7b7" fontSize="8">p53 Active</text>

          {/* Arrow */}
          <path d="M 400 58 L 420 58" stroke="#34d399" strokeWidth="1.5" />

          {/* Step 3: p21 expression */}
          <rect x="420" y="45" width="95" height="26" rx="3" fill="#14532d" stroke="#a3e635" strokeWidth="1.5" />
          <text x="467" y="61" textAnchor="middle" fill="#bef264" fontSize="8" fontWeight="bold">p21 (CIP1/WAF1)</text>

          {/* Inhibitory T-Bar down to target */}
          <path d="M 467 71 L 467 95" stroke="#ef4444" strokeWidth="2" />
          <line x1="457" y1="95" x2="477" y2="95" stroke="#ef4444" strokeWidth="3" />
          <text x="482" y="90" fill="#ef4444" fontSize="9" fontWeight="bold">INHIBITS</text>

          {/* Target Box (CDK/Cyclin complex) */}
          <rect
            x="240"
            y="105"
            width="275"
            height="38"
            rx="4"
            fill="#1e293b"
            stroke={isRevealed ? '#a3e635' : '#38bdf8'}
            strokeWidth="1.5"
            strokeDasharray={isRevealed ? 'none' : '3,3'}
          />
          <text
            x="377"
            y="122"
            textAnchor="middle"
            fill={isRevealed ? '#bef264' : '#e2e8f0'}
            fontSize="9"
            fontWeight="bold"
          >
            {isRevealed ? '✓ Target: CDK4/6-Cyclin D & CDK2-Cyclin E' : 'Target Kinase Complex (?)'}
          </text>
          <text x="377" y="134" textAnchor="middle" fill="#94a3b8" fontSize="8">
            Blocks Rb phosphorylation → E2F stays locked → S-phase arrest
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
