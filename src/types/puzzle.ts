export type PuzzleType = 
  | 'enzyme_kinetics' 
  | 'renal_osmolarity' 
  | 'metabolic_flux' 
  | 'membrane_potential' 
  | 'hardy_weinberg' 
  | 'cell_cycle_checkpoint' 
  | 'lac_operon_regulation'
  | 'hemoglobin_bohr';

export type InteractionMode = 'numeric_slider' | 'discrete_choice' | 'curve_marker';

export interface DiscreteOption {
  id: string;
  label: string;
  sublabel?: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface PuzzleNumericTarget {
  targetValue: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  toleranceExact: number;    // Absolute or percentage error for "Spot on."
  toleranceClose: number;    // Error for "Close enough."
  formatValue?: (val: number) => string;
}

export interface PuzzleGrade {
  verdict: 'Spot on.' | 'Close enough.' | 'Not quite.';
  scoreNormalized: number;   // 0 to 1
  difference?: number;
  userDisplay: string;
  targetDisplay: string;
}

export interface PuzzleData {
  id: string;
  puzzleNumber: number;
  topic: string;             // e.g. "MCAT BIO · ENZYME KINETICS"
  subtopic: string;          // e.g. "Competitive Inhibition & Apparent Km"
  prompt: string;            // 1-2 punchy sentences (~15-25 words max)
  mode: InteractionMode;
  type: PuzzleType;
  
  // Specific interaction configurations
  numericTarget?: PuzzleNumericTarget;
  discreteOptions?: DiscreteOption[];
  initialValue: number | string;

  // Feedback & Solution details
  targetSummary: string;     // 1-sentence takeaway summary
  whyExplanation: string;    // 2-3 concise sentences focusing on first-principles MCAT biology
  highYieldYieldNote?: string; // High-yield MCAT memory hook or equation

  // Diagram specific metadata
  diagramConfig: {
    title: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    baselineMarker?: { label: string; value: number };
    targetMarkerLabel?: string;
    extraNote?: string;
  };
}

export interface UserPuzzleSubmission {
  puzzleId: string;
  value: number | string;
  submittedAt: number;
  verdict: 'Spot on.' | 'Close enough.' | 'Not quite.';
  whyExpanded?: boolean;
}
