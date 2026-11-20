import React from 'react';
import { PuzzleData } from '../types/puzzle';
import { MichaelisMentenDiagram } from './BioDiagrams/MichaelisMentenDiagram';
import { NephronDiagram } from './BioDiagrams/NephronDiagram';
import { MetabolicFluxDiagram } from './BioDiagrams/MetabolicFluxDiagram';
import { ActionPotentialDiagram } from './BioDiagrams/ActionPotentialDiagram';
import { HardyWeinbergDiagram } from './BioDiagrams/HardyWeinbergDiagram';
import { CellCycleDiagram } from './BioDiagrams/CellCycleDiagram';
import { LacOperonDiagram } from './BioDiagrams/LacOperonDiagram';
import { HemoglobinBohrDiagram } from './BioDiagrams/HemoglobinBohrDiagram';

interface Props {
  puzzle: PuzzleData;
  userValue: number | string;
  onChange: (val: number | string) => void;
  isRevealed: boolean;
}

export const BioPuzzleCanvas: React.FC<Props> = ({
  puzzle,
  userValue,
  onChange,
  isRevealed,
}) => {
  const numericVal = typeof userValue === 'number' ? userValue : Number(userValue) || 0;
  const stringVal = typeof userValue === 'string' ? userValue : String(userValue);
  const targetVal = puzzle.numericTarget?.targetValue ?? 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Diagram Title & Scope Header */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <span className="w-2 h-2 rounded-full bg-retro-lime animate-pulse" />
          {puzzle.diagramConfig.title}
        </span>
        {puzzle.diagramConfig.extraNote && (
          <span className="hidden sm:inline-block text-slate-400 text-[10px] italic">
            {puzzle.diagramConfig.extraNote}
          </span>
        )}
      </div>

      {/* Dynamic Diagram Router */}
      <div className="w-full">
        {puzzle.type === 'enzyme_kinetics' && (
          <MichaelisMentenDiagram
            userValue={numericVal}
            onChange={onChange}
            isRevealed={isRevealed}
            targetValue={targetVal}
          />
        )}

        {puzzle.type === 'renal_osmolarity' && (
          <NephronDiagram
            userValue={numericVal}
            onChange={onChange}
            isRevealed={isRevealed}
            targetValue={targetVal}
          />
        )}

        {puzzle.type === 'metabolic_flux' && (
          <MetabolicFluxDiagram
            userValue={numericVal}
            onChange={onChange}
            isRevealed={isRevealed}
            targetValue={targetVal}
          />
        )}

        {puzzle.type === 'membrane_potential' && (
          <ActionPotentialDiagram
            userValue={numericVal}
            onChange={onChange}
            isRevealed={isRevealed}
            targetValue={targetVal}
          />
        )}

        {puzzle.type === 'hardy_weinberg' && (
          <HardyWeinbergDiagram
            userValue={numericVal}
            onChange={onChange}
            isRevealed={isRevealed}
            targetValue={targetVal}
          />
        )}

        {puzzle.type === 'cell_cycle_checkpoint' && (
          <CellCycleDiagram
            userChoice={stringVal}
            onChange={onChange}
            isRevealed={isRevealed}
            options={puzzle.discreteOptions ?? []}
          />
        )}

        {puzzle.type === 'lac_operon_regulation' && (
          <LacOperonDiagram
            userChoice={stringVal}
            onChange={onChange}
            isRevealed={isRevealed}
            options={puzzle.discreteOptions ?? []}
          />
        )}

        {puzzle.type === 'hemoglobin_bohr' && (
          <HemoglobinBohrDiagram
            userValue={numericVal}
            onChange={onChange}
            isRevealed={isRevealed}
            targetValue={targetVal}
          />
        )}
      </div>
    </div>
  );
};
