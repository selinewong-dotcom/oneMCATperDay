import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PUZZLES, getDailyPuzzleIndex, getPuzzleByIdOrIndex } from './data/puzzles';
import { PuzzleGrade, UserPuzzleSubmission } from './types/puzzle';
import { SceneBackdrop } from './components/SceneBackdrop';
import { Header } from './components/Header';
import { PuzzleCard } from './components/PuzzleCard';
import { ArchiveDrawer } from './components/ArchiveDrawer';
import { BottomRightTag } from './components/BottomRightTag';
import { ScanlineOverlay } from './components/ScanlineOverlay';
import { soundFX } from './utils/audio';

export const App: React.FC = () => {
  // Determine active puzzle index from URL query (?puzzle=X or ?day=X) or fallback to UTC day
  const dailyIdx = useMemo(() => getDailyPuzzleIndex(), []);

  const [activeIdx, setActiveIdx] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryPuzzle = params.get('puzzle') ?? params.get('day');
      if (queryPuzzle !== null) {
        const parsed = parseInt(queryPuzzle, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < PUZZLES.length) {
          return parsed;
        }
      }
    }
    return dailyIdx;
  });

  const activePuzzle = useMemo(() => getPuzzleByIdOrIndex(activeIdx), [activeIdx]);

  // Submissions storage map
  const [submissions, setSubmissions] = useState<Record<string, UserPuzzleSubmission>>(() => {
    try {
      const saved = localStorage.getItem('fp_bio_submissions_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Current interactive candidate value
  const [currentValue, setCurrentValue] = useState<number | string>(() => {
    const saved = submissions[activePuzzle.id];
    if (saved) return saved.value;
    return activePuzzle.initialValue;
  });

  // State flags
  const [whyExpanded, setWhyExpanded] = useState<boolean>(() => {
    return !!submissions[activePuzzle.id]?.whyExpanded;
  });
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(false);

  // Sync current value and why state when active puzzle changes
  useEffect(() => {
    const saved = submissions[activePuzzle.id];
    if (saved) {
      setCurrentValue(saved.value);
      setWhyExpanded(!!saved.whyExpanded);
    } else {
      setCurrentValue(activePuzzle.initialValue);
      setWhyExpanded(false);
    }
  }, [activePuzzle.id, submissions]);

  // Persist submissions
  const saveSubmission = useCallback((sub: UserPuzzleSubmission) => {
    setSubmissions((prev) => {
      const updated = { ...prev, [sub.puzzleId]: sub };
      try {
        localStorage.setItem('fp_bio_submissions_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Handle Submission from PuzzleCard
  const handleSubmit = (grade: PuzzleGrade) => {
    const sub: UserPuzzleSubmission = {
      puzzleId: activePuzzle.id,
      value: currentValue,
      submittedAt: Date.now(),
      verdict: grade.verdict,
      whyExpanded: false,
    };
    saveSubmission(sub);
  };

  // Handle Reset
  const handleReset = () => {
    setSubmissions((prev) => {
      const updated = { ...prev };
      delete updated[activePuzzle.id];
      try {
        localStorage.setItem('fp_bio_submissions_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setCurrentValue(activePuzzle.initialValue);
    setWhyExpanded(false);
  };

  // Toggle Why drawer with persistence
  const handleToggleWhy = () => {
    const nextState = !whyExpanded;
    setWhyExpanded(nextState);
    if (submissions[activePuzzle.id]) {
      const updatedSub = {
        ...submissions[activePuzzle.id],
        whyExpanded: nextState,
      };
      saveSubmission(updatedSub);
    }
  };

  // Select puzzle and update URL query (?puzzle=X)
  const handleSelectPuzzle = (idx: number) => {
    setActiveIdx(idx);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('puzzle', String(idx));
    window.history.pushState({}, '', newUrl.toString());
  };

  // Sound toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playClick();
  };

  // Clear all progress
  const handleClearAllProgress = () => {
    localStorage.removeItem('fp_bio_submissions_v1');
    setSubmissions({});
    setCurrentValue(activePuzzle.initialValue);
    setWhyExpanded(false);
  };

  // Navigation: Next / Previous puzzle
  const handlePrevPuzzle = () => {
    const prev = (activeIdx - 1 + PUZZLES.length) % PUZZLES.length;
    handleSelectPuzzle(prev);
    soundFX.playClick();
  };

  const handleNextPuzzle = () => {
    const next = (activeIdx + 1) % PUZZLES.length;
    handleSelectPuzzle(next);
    soundFX.playClick();
  };

  const isRevealed = !!submissions[activePuzzle.id];
  const currentGrade: PuzzleGrade | undefined = useMemo(() => {
    const sub = submissions[activePuzzle.id];
    if (!sub) return undefined;
    return {
      verdict: sub.verdict,
      scoreNormalized: sub.verdict === 'Spot on.' ? 1.0 : sub.verdict === 'Close enough.' ? 0.75 : 0.25,
      userDisplay:
        typeof sub.value === 'number' && activePuzzle.numericTarget?.formatValue
          ? activePuzzle.numericTarget.formatValue(sub.value)
          : String(sub.value),
      targetDisplay:
        activePuzzle.mode === 'discrete_choice'
          ? activePuzzle.discreteOptions?.find((o) => o.isCorrect)?.label || ''
          : activePuzzle.numericTarget?.formatValue
          ? activePuzzle.numericTarget.formatValue(activePuzzle.numericTarget.targetValue)
          : String(activePuzzle.numericTarget?.targetValue || ''),
    };
  }, [submissions, activePuzzle]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between font-mono bg-navy-950 text-slate-100">
      {/* Visual Procedural Pixel Art Backdrop */}
      <SceneBackdrop />

      {/* CRT Scanline Overlay */}
      <ScanlineOverlay enabled={scanlinesEnabled} />

      {/* Top Header */}
      <Header
        onOpenArchive={() => setIsArchiveOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled(!scanlinesEnabled)}
        currentDayPuzzleNumber={activePuzzle.puzzleNumber}
        totalPuzzles={PUZZLES.length}
      />

      {/* Main Center Stage: Central Puzzle Card Floating Over Laboratory Bench */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-2 relative z-10">
        {/* Daily Indicator & Navigation Tabs */}
        <div className="w-full max-w-2xl flex items-center justify-between mb-2 text-xs font-mono text-slate-400 select-none">
          <button
            onClick={handlePrevPuzzle}
            className="px-2 py-1 bg-navy-950/70 hover:bg-navy-900 border border-slate-800 rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Previous puzzle"
          >
            <span>←</span>
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-retro-lime font-bold">
              MCAT Biology #{activePuzzle.puzzleNumber}
            </span>
            {activeIdx === dailyIdx && (
              <span className="text-[10px] bg-retro-lime/20 text-retro-paleLime px-1.5 py-0.5 rounded border border-retro-lime/30 font-semibold">
                TODAY'S DAILY
              </span>
            )}
          </div>

          <button
            onClick={handleNextPuzzle}
            className="px-2 py-1 bg-navy-950/70 hover:bg-navy-900 border border-slate-800 rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Next puzzle"
          >
            <span className="hidden sm:inline">Next</span>
            <span>→</span>
          </button>
        </div>

        {/* Central Core Puzzle Card */}
        <PuzzleCard
          puzzle={activePuzzle}
          userValue={currentValue}
          onChange={setCurrentValue}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isRevealed={isRevealed}
          whyExpanded={whyExpanded}
          onToggleWhy={handleToggleWhy}
          grade={currentGrade}
        />
      </main>

      {/* Bottom Subtle Bar & Tag */}
      <footer className="w-full p-4 flex items-center justify-between select-none relative z-10 pointer-events-none">
        <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
          Use mouse or arrow keys to predict · Enter to submit
        </div>
        <BottomRightTag topic={activePuzzle.topic} />
      </footer>

      {/* Archive Drawer */}
      <ArchiveDrawer
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        currentPuzzleId={activePuzzle.id}
        onSelectPuzzle={handleSelectPuzzle}
        submissions={submissions}
        onClearProgress={handleClearAllProgress}
      />
    </div>
  );
};
