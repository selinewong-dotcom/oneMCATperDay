import React from 'react';
import { soundFX } from '../utils/audio';

interface Props {
  onOpenArchive: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  currentDayPuzzleNumber: number;
  totalPuzzles: number;
}

export const Header: React.FC<Props> = ({
  onOpenArchive,
  soundEnabled,
  onToggleSound,
  scanlinesEnabled,
  onToggleScanlines,
  currentDayPuzzleNumber,
  totalPuzzles,
}) => {
  return (
    <header className="w-full flex items-start justify-between p-4 sm:p-6 select-none relative z-20">
      {/* Top-Left Header: Title and Subtitle */}
      <div className="flex flex-col">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            soundFX.playClick();
            window.location.href = window.location.pathname;
          }}
          className="group inline-flex items-baseline gap-2 cursor-pointer"
        >
          <span className="font-pixel text-lg sm:text-xl tracking-tight text-slate-100 group-hover:text-retro-lime transition-colors">
            first principles
          </span>
          <span className="w-2 h-2 rounded-sm bg-retro-lime/80 group-hover:bg-retro-paleLime inline-block animate-pulse" />
        </a>
        <span className="text-[11px] sm:text-xs font-mono text-slate-400 tracking-wide mt-0.5">
          — One MCAT Biology puzzle a day
        </span>
      </div>

      {/* Top-Right Controls */}
      <div className="flex items-center gap-2 font-mono text-xs">
        {/* Archive Selector Trigger */}
        <button
          onClick={() => {
            soundFX.playClick();
            onOpenArchive();
          }}
          className="px-2.5 py-1.5 bg-navy-900/80 hover:bg-navy-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          title="Browse puzzle library"
        >
          <span className="text-retro-lime">☰</span>
          <span>Puzzle {currentDayPuzzleNumber} of {totalPuzzles}</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded border transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-navy-900/80 border-slate-800 text-slate-300 hover:text-slate-100'
              : 'bg-navy-950/80 border-slate-800/60 text-slate-600'
          }`}
          title={soundEnabled ? 'Mute retro audio' : 'Unmute retro audio'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        {/* CRT Scanlines Toggle */}
        <button
          onClick={onToggleScanlines}
          className={`px-2 py-1 rounded border text-[11px] transition-all cursor-pointer ${
            scanlinesEnabled
              ? 'bg-retro-lime/10 border-retro-lime/40 text-retro-lime'
              : 'bg-navy-900/80 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle retro CRT scanlines"
        >
          CRT
        </button>
      </div>
    </header>
  );
};
