import React from 'react';
import { PUZZLES } from '../data/puzzles';
import { soundFX } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPuzzleId: string;
  onSelectPuzzle: (index: number) => void;
  submissions: Record<string, { verdict: string }>;
  onClearProgress: () => void;
}

export const ArchiveDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  currentPuzzleId,
  onSelectPuzzle,
  submissions,
  onClearProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full bg-navy-950 border-l border-slate-800 p-5 flex flex-col justify-between shadow-2xl select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-pixel text-base text-slate-100 flex items-center gap-2">
                <span>Puzzle Archive</span>
                <span className="text-[10px] font-mono text-retro-lime bg-navy-900 px-2 py-0.5 rounded border border-retro-lime/20">
                  {Object.keys(submissions).length} / {PUZZLES.length} solved
                </span>
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Select any daily MCAT biology puzzle
              </p>
            </div>
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded border border-slate-800 hover:border-slate-700 font-mono text-xs cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          {/* Puzzle List */}
          <div className="mt-4 flex flex-col gap-2 max-h-[calc(100vh-210px)] overflow-y-auto pr-1">
            {PUZZLES.map((puzzle, idx) => {
              const isCurrent = puzzle.id === currentPuzzleId;
              const sub = submissions[puzzle.id];

              return (
                <button
                  key={puzzle.id}
                  onClick={() => {
                    soundFX.playClick();
                    onSelectPuzzle(idx);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-retro-lime bg-retro-lime/10 shadow-glow-green text-slate-100'
                      : 'border-slate-800/80 bg-navy-900/60 hover:bg-navy-900 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-retro-lime">
                        #{puzzle.puzzleNumber}
                      </span>
                      <span className="text-xs font-semibold">{puzzle.subtopic}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {puzzle.topic}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono shrink-0 ml-2">
                    {sub ? (
                      <span
                        className={`px-2 py-0.5 rounded border text-[10px] ${
                          sub.verdict === 'Spot on.'
                            ? 'border-retro-lime text-retro-lime bg-retro-lime/10'
                            : sub.verdict === 'Close enough.'
                            ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                            : 'border-rose-400 text-rose-400 bg-rose-400/10'
                        }`}
                      >
                        {sub.verdict}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[10px]">Unsolved</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <button
            onClick={() => {
              if (confirm('Clear saved answers and reset all puzzle progress?')) {
                onClearProgress();
              }
            }}
            className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
          >
            Clear local progress
          </button>
          <span className="text-[10px] text-slate-600">First Principles MCAT</span>
        </div>
      </div>
    </div>
  );
};
