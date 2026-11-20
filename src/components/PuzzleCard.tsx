import React, { useState } from 'react';
import { PuzzleData, PuzzleGrade } from '../types/puzzle';
import { BioPuzzleCanvas } from './BioPuzzleCanvas';
import { soundFX } from '../utils/audio';

interface Props {
  puzzle: PuzzleData;
  userValue: number | string;
  onChange: (val: number | string) => void;
  onSubmit: (grade: PuzzleGrade) => void;
  onReset: () => void;
  isRevealed: boolean;
  whyExpanded: boolean;
  onToggleWhy: () => void;
  grade?: PuzzleGrade;
}

export const PuzzleCard: React.FC<Props> = ({
  puzzle,
  userValue,
  onChange,
  onSubmit,
  onReset,
  isRevealed,
  whyExpanded,
  onToggleWhy,
  grade,
}) => {
  const [copied, setCopied] = useState(false);

  // Compute grading logic
  const calculateGrade = (): PuzzleGrade => {
    if (puzzle.mode === 'discrete_choice') {
      const selectedOpt = puzzle.discreteOptions?.find(o => o.id === userValue);
      const isCorrect = !!selectedOpt?.isCorrect;
      const targetOpt = puzzle.discreteOptions?.find(o => o.isCorrect);

      return {
        verdict: isCorrect ? 'Spot on.' : 'Not quite.',
        scoreNormalized: isCorrect ? 1.0 : 0.0,
        userDisplay: selectedOpt?.label || 'None selected',
        targetDisplay: targetOpt?.label || '',
      };
    } else {
      const numVal = typeof userValue === 'number' ? userValue : Number(userValue);
      const target = puzzle.numericTarget!;
      const diff = Math.abs(numVal - target.targetValue);
      let verdict: 'Spot on.' | 'Close enough.' | 'Not quite.';

      if (diff <= target.toleranceExact) {
        verdict = 'Spot on.';
      } else if (diff <= target.toleranceClose) {
        verdict = 'Close enough.';
      } else {
        verdict = 'Not quite.';
      }

      const format = target.formatValue || ((v: number) => `${v} ${target.unit}`);
      return {
        verdict,
        scoreNormalized: Math.max(0, 1 - diff / (target.max - target.min)),
        difference: numVal - target.targetValue,
        userDisplay: format(numVal),
        targetDisplay: format(target.targetValue),
      };
    }
  };

  const handleSubmit = () => {
    if (isRevealed) return;
    if (puzzle.mode === 'discrete_choice' && (userValue === 'none' || !userValue)) {
      return;
    }
    const computed = calculateGrade();
    if (computed.verdict === 'Spot on.') {
      soundFX.playSuccess();
    } else if (computed.verdict === 'Close enough.') {
      soundFX.playClose();
    } else {
      soundFX.playMiss();
    }
    onSubmit(computed);
  };

  const handleShare = async () => {
    soundFX.playClick();
    const currentGrade = grade || calculateGrade();
    const emoji = currentGrade.verdict === 'Spot on.' ? '🎯' : currentGrade.verdict === 'Close enough.' ? '⚡' : '🧠';
    const text = [
      `First Principles — MCAT Bio #${puzzle.puzzleNumber}`,
      `Topic: ${puzzle.subtopic}`,
      `Result: ${currentGrade.verdict} ${emoji}`,
      `Prediction: ${currentGrade.userDisplay} · Target: ${currentGrade.targetDisplay}`,
      `https://firstprinciples.day?puzzle=${puzzle.puzzleNumber - 1}`
    ].join('\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure or restricted clipboard
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback alert
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const activeGrade = grade || (isRevealed ? calculateGrade() : undefined);

  return (
    <div className="w-full max-w-2xl bg-navy-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 sm:p-6 shadow-2xl relative z-10 transition-all">
      {/* Top Meta Line: Subtopic Badge & Step Indicator */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-navy-950/90 px-2.5 py-1 rounded border border-slate-800">
          {puzzle.subtopic}
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Daily MCAT #{puzzle.puzzleNumber}
        </span>
      </div>

      {/* Short & Punchy Prompt (1-2 sentences max) */}
      <h2 className="text-base sm:text-lg font-medium text-slate-100 leading-snug tracking-tight mb-4">
        {puzzle.prompt}
      </h2>

      {/* Biological Diagram Canvas */}
      <div className="my-2 bg-navy-950/60 p-3 rounded-lg border border-slate-800/80">
        <BioPuzzleCanvas
          puzzle={puzzle}
          userValue={userValue}
          onChange={onChange}
          isRevealed={isRevealed}
        />
      </div>

      {/* Footer Phase Controller */}
      {!isRevealed ? (
        /* Prediction Phase: Live Candidate Value & Submit Button */
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span>Your candidate:</span>
            <span className="text-retro-lime font-bold text-sm bg-navy-950 px-2 py-0.5 rounded border border-retro-lime/30">
              {puzzle.mode === 'discrete_choice'
                ? puzzle.discreteOptions?.find(o => o.id === userValue)?.label || 'Select an option'
                : puzzle.numericTarget?.formatValue
                ? puzzle.numericTarget.formatValue(Number(userValue))
                : userValue}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={puzzle.mode === 'discrete_choice' && (userValue === 'none' || !userValue)}
            className="w-full sm:w-auto px-6 py-2.5 bg-retro-lime hover:bg-retro-paleLime active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-navy-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg shadow-glow-green transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Submit Prediction</span>
            <span>→</span>
          </button>
        </div>
      ) : (
        /* Revealed / Solution Phase */
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col gap-4 animate-in fade-in duration-300">
          {/* Verdict Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-navy-950/80 p-3.5 rounded-lg border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-base font-bold font-mono tracking-wide ${
                    activeGrade?.verdict === 'Spot on.'
                      ? 'text-retro-lime'
                      : activeGrade?.verdict === 'Close enough.'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {activeGrade?.verdict}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {activeGrade?.verdict === 'Spot on.'
                    ? '🎯 Exact biological intuition'
                    : activeGrade?.verdict === 'Close enough.'
                    ? '⚡ Well within physiological tolerance'
                    : '📖 High-yield review opportunity'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                {puzzle.targetSummary}
              </p>
            </div>

            {/* Prediction vs Target Stats Badge */}
            <div className="flex flex-col items-start sm:items-end text-[11px] font-mono text-slate-400 bg-navy-900 px-3 py-1.5 rounded border border-slate-800 shrink-0">
              <div>
                Prediction: <span className="text-slate-200 font-semibold">{activeGrade?.userDisplay}</span>
              </div>
              <div>
                Target: <span className="text-retro-lime font-semibold">{activeGrade?.targetDisplay}</span>
              </div>
            </div>
          </div>

          {/* Action Row: Why? Toggle, Send to a Friend, and Retry */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFX.playClick();
                  onToggleWhy();
                }}
                className={`px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                  whyExpanded
                    ? 'bg-retro-lime/20 border-retro-lime text-retro-paleLime shadow-glow-green'
                    : 'bg-navy-950 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span>Why?</span>
                <span className="text-[10px]">{whyExpanded ? '▲' : '▼'}</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-1.5 bg-navy-950 border border-slate-700 hover:border-slate-500 text-slate-300 rounded text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{copied ? '✓ Copied!' : 'Send to a friend'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                onReset();
              }}
              className="text-[11px] font-mono text-slate-400 hover:text-slate-300 underline cursor-pointer"
            >
              Reset & Try again
            </button>
          </div>

          {/* Why? Mechanism Drawer (Collapsible First-Principles Explanation) */}
          {whyExpanded && (
            <div className="bg-navy-950/95 border border-retro-lime/30 rounded-lg p-3.5 text-xs text-slate-300 leading-relaxed font-sans shadow-inner animate-in fade-in duration-200">
              <div className="text-[11px] font-mono uppercase tracking-wider text-retro-lime font-semibold mb-1 flex items-center gap-1.5">
                <span>⚡ First-Principles Mechanism</span>
              </div>
              <p className="mb-2.5">{puzzle.whyExplanation}</p>
              {puzzle.highYieldYieldNote && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-start gap-1.5">
                  <span className="text-amber-400 shrink-0">KEY MCAT TAKEAWAY:</span>
                  <span>{puzzle.highYieldYieldNote}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
