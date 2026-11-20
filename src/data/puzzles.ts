import { PuzzleData } from '../types/puzzle';

export const PUZZLES: PuzzleData[] = [
  {
    id: 'mcat-bio-01-enzyme-kinetics',
    puzzleNumber: 1,
    topic: 'MCAT BIO · ENZYME KINETICS',
    subtopic: 'Competitive Inhibition & Apparent Km',
    prompt: 'A competitive inhibitor binds an enzyme with baseline Km = 4.0 mM. Drag the marker to the new apparent Km when substrate affinity drops twofold.',
    mode: 'numeric_slider',
    type: 'enzyme_kinetics',
    initialValue: 4.0,
    numericTarget: {
      targetValue: 8.0,
      unit: 'mM',
      min: 1.0,
      max: 16.0,
      step: 0.2,
      toleranceExact: 0.5,
      toleranceClose: 1.2,
      formatValue: (v) => `${v.toFixed(1)} mM`,
    },
    targetSummary: 'Competitive inhibitors increase apparent Km twofold (4.0 mM → 8.0 mM) without altering Vmax.',
    whyExplanation: 'Competitive inhibitors compete directly with substrate for the catalytic active site. Higher substrate concentrations overcome the inhibition, leaving Vmax unchanged while doubling the substrate concentration required to reach half-maximal velocity (apparent Km).',
    highYieldYieldNote: 'Michaelis-Menten: Km_app = Km · (1 + [I]/Ki). Lineweaver-Burk: x-intercept (-1/Km) shifts closer to origin; y-intercept (1/Vmax) is unchanged.',
    diagramConfig: {
      title: 'Michaelis-Menten Kinetics: [S] vs Velocity',
      xAxisLabel: 'Substrate Concentration [S] (mM)',
      yAxisLabel: 'Reaction Velocity (V)',
      baselineMarker: { label: 'Baseline Km (4.0 mM)', value: 4.0 },
      targetMarkerLabel: 'Apparent Km (Inhibited)',
      extraNote: 'Vmax remains unchanged at high [S].'
    }
  },
  {
    id: 'mcat-bio-02-renal-osmolarity',
    puzzleNumber: 2,
    topic: 'MCAT BIO · RENAL PHYSIOLOGY',
    subtopic: 'Countercurrent Multiplication & Vasopressin (ADH)',
    prompt: 'Maximal vasopressin (ADH) induces aquaporin-2 translocation in the medullary collecting duct. Set the final concentrated urine osmolarity.',
    mode: 'numeric_slider',
    type: 'renal_osmolarity',
    initialValue: 300,
    numericTarget: {
      targetValue: 1200,
      unit: 'mOsm/L',
      min: 100,
      max: 1400,
      step: 25,
      toleranceExact: 50,
      toleranceClose: 125,
      formatValue: (v) => `${Math.round(v)} mOsm/L`,
    },
    targetSummary: 'Under maximal ADH, tubular fluid equilibrates with the hyperosmotic inner renal medulla at 1200 mOsm/L.',
    whyExplanation: 'The countercurrent multiplier system establishes a corticomedullary osmotic gradient from 300 mOsm/L in the cortex to 1200 mOsm/L in the inner medulla. ADH drives aquaporin-2 channels into collecting duct apical membranes, causing water to passively leave tubular fluid until it matches medullary interstitial osmolarity.',
    highYieldYieldNote: 'Aldosterone increases Na+ reabsorption in the DCT/collecting duct without changing osmolarity directly; ADH specifically regulates pure water reabsorption, concentrating urine.',
    diagramConfig: {
      title: 'Nephron Corticomedullary Osmotic Gradient',
      xAxisLabel: 'Nephron Depth (Cortex → Inner Medulla)',
      yAxisLabel: 'Tubular & Interstitial Osmolarity (mOsm/L)',
      baselineMarker: { label: 'Isotonic Filtrate (300 mOsm/L)', value: 300 },
      targetMarkerLabel: 'Max Concentrated Urine',
      extraNote: 'Inner medullary interstitium reaches ~1200 mOsm/L via urea recycling & NKCC2.'
    }
  },
  {
    id: 'mcat-bio-03-metabolic-flux',
    puzzleNumber: 3,
    topic: 'MCAT BIO · METABOLISM',
    subtopic: 'Glycerol-3-Phosphate vs Malate-Aspartate Shuttle',
    prompt: 'In skeletal muscle, cytosolic NADH delivers electrons via the glycerol-3-phosphate shuttle rather than malate-aspartate. Predict the net ATP yield per glucose.',
    mode: 'numeric_slider',
    type: 'metabolic_flux',
    initialValue: 32,
    numericTarget: {
      targetValue: 30,
      unit: 'ATP',
      min: 24,
      max: 38,
      step: 1,
      toleranceExact: 0.5,
      toleranceClose: 1.5,
      formatValue: (v) => `${Math.round(v)} ATP`,
    },
    targetSummary: 'The glycerol-3-phosphate shuttle yields 30 net ATP per glucose (vs 32 via the malate-aspartate shuttle).',
    whyExplanation: 'Cytosolic NADH cannot cross the inner mitochondrial membrane. The glycerol-3-phosphate shuttle transfers electrons directly to mitochondrial FAD, forming FADH2 which enters Complex II (~1.5 ATP/NADH), losing 1 ATP per cytosolic NADH (2 ATP total loss per glucose compared to Complex I entry).',
    highYieldYieldNote: 'Malate-aspartate shuttle (heart/liver) yields ~2.5 ATP/NADH (32 ATP total). Glycerol-3-P shuttle (muscle/brain) yields ~1.5 ATP/NADH (30 ATP total).',
    diagramConfig: {
      title: 'Substrate-Level & Oxidative Phosphorylation Yield',
      xAxisLabel: 'Cellular Respiration Flux',
      yAxisLabel: 'Net ATP Generated',
      baselineMarker: { label: 'Malate-Aspartate Yield (32 ATP)', value: 32 },
      targetMarkerLabel: 'Glycerol-3-Phosphate Shuttle Yield',
      extraNote: 'Complex II entry bypasses Complex I proton pumping (4 H+ missed).'
    }
  },
  {
    id: 'mcat-bio-04-membrane-potential',
    puzzleNumber: 4,
    topic: 'MCAT BIO · NEUROBIOLOGY',
    subtopic: 'Nernst-Goldman Potential & Hyperkalemia',
    prompt: 'Extracellular K+ increases from 4.0 mM to 8.0 mM in a resting neuron. Using Goldman-Nernst intuition, predict the depolarized resting membrane potential (Vm).',
    mode: 'numeric_slider',
    type: 'membrane_potential',
    initialValue: -70,
    numericTarget: {
      targetValue: -53,
      unit: 'mV',
      min: -95,
      max: -30,
      step: 1,
      toleranceExact: 3,
      toleranceClose: 7,
      formatValue: (v) => `${Math.round(v)} mV`,
    },
    targetSummary: 'Doubling extracellular K+ shifts the K+ reversal potential positive, depolarizing resting Vm from -70 mV to ~ -53 mV.',
    whyExplanation: 'At rest, neuronal membrane permeability is dominated by potassium leak channels (PK >> PNa). By the Nernst equation (E_K = 61.5 · log10([K+]out/[K+]in)), increasing [K+]out reduces the chemical gradient opposing electrical exit, shifting E_K and resting Vm toward threshold.',
    highYieldYieldNote: 'Nernst Equation: E_ion = (61.5 / z) · log10([ion]outside / [ion]inside) at 37°C. Hyperkalemia depolarizes resting membrane potential, paradoxically causing inactivation of voltage-gated Na+ channels.',
    diagramConfig: {
      title: 'Neuronal Membrane Potential & Ion Equilibria',
      xAxisLabel: 'Membrane Polarity State',
      yAxisLabel: 'Membrane Potential (mV)',
      baselineMarker: { label: 'Baseline Vm (-70 mV)', value: -70 },
      targetMarkerLabel: 'Depolarized Resting Vm',
      extraNote: 'Threshold for action potential generation is typically ~ -55 mV.'
    }
  },
  {
    id: 'mcat-bio-05-hardy-weinberg',
    puzzleNumber: 5,
    topic: 'MCAT BIO · GENETICS',
    subtopic: 'Hardy-Weinberg Equilibrium & Carrier Frequency',
    prompt: 'An autosomal recessive metabolic disorder affects 1 in 10,000 live births (q² = 0.0001). Drag the marker to the estimated carrier frequency (2pq).',
    mode: 'numeric_slider',
    type: 'hardy_weinberg',
    initialValue: 0.5,
    numericTarget: {
      targetValue: 1.98,
      unit: '%',
      min: 0.1,
      max: 5.0,
      step: 0.05,
      toleranceExact: 0.15,
      toleranceClose: 0.4,
      formatValue: (v) => `${v.toFixed(2)}%`,
    },
    targetSummary: 'Carrier frequency (2pq) is approximately 1.98% (~1 in 50 individuals).',
    whyExplanation: 'Since q² = 0.0001, the mutant allele frequency is q = √0.0001 = 0.01 (1%). The wild-type allele frequency is p = 1 - 0.01 = 0.99 (99%). The heterozygote carrier frequency is 2pq = 2 · 0.99 · 0.01 = 0.0198 or 1.98%.',
    highYieldYieldNote: 'Hardy-Weinberg equations: p + q = 1 and p² + 2pq + q² = 1. In rare recessive diseases where q << 1, p ≈ 1, so carrier frequency 2pq ≈ 2q.',
    diagramConfig: {
      title: 'Hardy-Weinberg Genotype Frequencies vs q',
      xAxisLabel: 'Recessive Allele Frequency (q)',
      yAxisLabel: 'Genotype Frequency (%)',
      baselineMarker: { label: 'Affected Frequency q² (0.01%)', value: 0.01 },
      targetMarkerLabel: 'Carrier Heterozygotes (2pq)',
      extraNote: 'Carriers vastly outnumber affected individuals when the disease allele is rare.'
    }
  },
  {
    id: 'mcat-bio-06-cell-cycle',
    puzzleNumber: 6,
    topic: 'MCAT BIO · CELL CYCLE & ONCOLOGY',
    subtopic: 'G1/S Checkpoint & p53 Pathway',
    prompt: 'Ionizing radiation causes double-stranded DNA breaks in early G1. Select the regulatory kinase complex directly inhibited by p53-induced p21 to arrest the cycle.',
    mode: 'discrete_choice',
    type: 'cell_cycle_checkpoint',
    initialValue: 'none',
    discreteOptions: [
      {
        id: 'cdk4-cyclinD',
        label: 'CDK4 / Cyclin D & CDK2 / Cyclin E',
        sublabel: 'G1-to-S transition kinase complexes',
        isCorrect: true,
        explanation: 'p21 (CIP1/WAF1) is a cyclin-dependent kinase inhibitor that directly binds and inactivates G1 CDK4/6-Cyclin D and CDK2-Cyclin E complexes, preventing Rb phosphorylation and S-phase entry.'
      },
      {
        id: 'cdk1-cyclinB',
        label: 'CDK1 / Cyclin B (MPF)',
        sublabel: 'G2-to-M mitotic promoting factor',
        isCorrect: false,
        explanation: 'CDK1-Cyclin B regulates the G2/M mitotic transition checkpoint, not the early G1/S arrest governed by p21.'
      },
      {
        id: 'apc-cdc20',
        label: 'APC/C (Anaphase-Promoting Complex)',
        sublabel: 'Spindle assembly checkpoint ubiquitin ligase',
        isCorrect: false,
        explanation: 'The APC/C mediates securin degradation during the metaphase-to-anaphase transition, not the G1 DNA damage checkpoint.'
      },
      {
        id: 'dna-helicase',
        label: 'MCM2-7 Replicative Helicase',
        sublabel: 'Origin replication licensing factor',
        isCorrect: false,
        explanation: 'While the MCM complex unwinds DNA at replication origins, p21 does not directly bind or inhibit helicase; it acts upstream on CDKs.'
      }
    ],
    targetSummary: 'p21 directly inhibits CDK4/6-Cyclin D and CDK2-Cyclin E, maintaining Rb in its hypophosphorylated active state.',
    whyExplanation: 'p53 is a tumor suppressor transcription factor stabilized upon DNA damage. It transcribes p21, a stoichiometric inhibitor of G1 CDKs. Without active CDK-cyclin complexes, Retinoblastoma protein (Rb) remains bound to E2F transcription factor, blocking S-phase gene expression.',
    highYieldYieldNote: 'Unphosphorylated Rb = active brake (binds E2F). Hyperphosphorylated Rb = inactive (releases E2F to trigger S-phase replication).',
    diagramConfig: {
      title: 'G1/S Checkpoint Molecular Cascade',
      xAxisLabel: 'Molecular Signaling Cascade',
      yAxisLabel: 'Activity State',
      targetMarkerLabel: 'Inhibited Target Complex',
      extraNote: 'ATM/ATR → Chk2 → p53 stabilization → p21 upregulation → CDK inhibition.'
    }
  },
  {
    id: 'mcat-bio-07-gene-regulation',
    puzzleNumber: 7,
    topic: 'MCAT BIO · MOLECULAR GENETICS',
    subtopic: 'Lac Operon Mutations & Allosteric Control',
    prompt: 'A nonsense mutation in the lacI gene produces a truncated non-functional repressor. Predict the transcription state of the operon in the absence of lactose.',
    mode: 'discrete_choice',
    type: 'lac_operon_regulation',
    initialValue: 'none',
    discreteOptions: [
      {
        id: 'constitutive',
        label: 'Constitutive Transcription (Always ON)',
        sublabel: 'High basal expression without lactose inducer',
        isCorrect: true,
        explanation: 'Because the LacI repressor cannot bind the operator (lacO), RNA polymerase has unobstructed access to transcribe lacZ, lacY, and lacA even with zero lactose present.'
      },
      {
        id: 'permanently-repressed',
        label: 'Permanently Repressed (Always OFF)',
        sublabel: 'No transcription even with lactose',
        isCorrect: false,
        explanation: 'A super-repressor (lacI^s) mutation causes permanent repression by failing to bind allolactose; a loss-of-function nonsense mutation does the opposite.'
      },
      {
        id: 'glucose-dependent-only',
        label: 'Strictly Catabolite-Repressed',
        sublabel: 'Depends solely on cAMP-CAP regardless of repressor',
        isCorrect: false,
        explanation: 'While cAMP-CAP modulates amplitude, the loss of repressor binding makes promoter clearance constitutive and unregulated by lactose.'
      },
      {
        id: 'inducible-as-wildtype',
        label: 'Normal Inducible Wild-Type State',
        sublabel: 'Off without lactose, On with lactose',
        isCorrect: false,
        explanation: 'Wild-type operons require allolactose to derepress; a mutated inactive repressor cannot hold the operon off.'
      }
    ],
    targetSummary: 'A defective repressor (lacI⁻) yields constitutive operon expression because the operator remains permanently unoccupied.',
    whyExplanation: 'The LacI protein is a negative regulator that binds the operator to sterically block RNA polymerase. A nonsense mutation produces a non-functional repressor unable to bind DNA, allowing RNA polymerase to transcribe structural genes continuously regardless of inducer presence.',
    highYieldYieldNote: 'Negative control: lacI (repressor binds operator). Positive control: CAP-cAMP (binds CAP site when glucose is low to recruit RNA polymerase).',
    diagramConfig: {
      title: 'Lac Operon Structural Architecture',
      xAxisLabel: 'DNA Coordinate',
      yAxisLabel: 'Repression vs Transcription Flux',
      targetMarkerLabel: 'Active Transcription Status',
      extraNote: 'lacI produces homotetramer repressor that loops operator DNA.'
    }
  },
  {
    id: 'mcat-bio-08-hemoglobin-bohr',
    puzzleNumber: 8,
    topic: 'MCAT BIO · RESPIRATORY PHYSIOLOGY',
    subtopic: 'Hemoglobin Allostery & The Bohr Effect',
    prompt: 'During vigorous exercise, exercising muscle experiences acidosis (pH 7.2) and hyperthermia. Predict the right-shifted P50 of hemoglobin (baseline P50 = 26.6 mmHg).',
    mode: 'numeric_slider',
    type: 'hemoglobin_bohr',
    initialValue: 26.6,
    numericTarget: {
      targetValue: 36.0,
      unit: 'mmHg',
      min: 15.0,
      max: 50.0,
      step: 0.5,
      toleranceExact: 1.5,
      toleranceClose: 3.5,
      formatValue: (v) => `${v.toFixed(1)} mmHg`,
    },
    targetSummary: 'The Bohr effect shifts the oxygen dissociation curve rightward, raising P50 to ~36 mmHg to facilitate O2 offloading.',
    whyExplanation: 'Increased H+ (low pH), high CO2, elevated 2,3-BPG, and rising temperature all stabilize the T-state (tense, deoxygenated) conformation of hemoglobin. This decreases oxygen affinity, requiring higher partial pressure (P50) to achieve 50% saturation and delivering oxygen to metabolically active tissues.',
    highYieldYieldNote: 'Mnemonic: "CADET, face RIGHT!" (CO2, Acid/H+, 2,3-DPG, Exercise, Temperature all shift the curve to the RIGHT). Right shift = decreased affinity = higher P50 = enhanced offloading.',
    diagramConfig: {
      title: 'O2-Hemoglobin Dissociation Curve & Right Shift',
      xAxisLabel: 'PO2 in Tissues (mmHg)',
      yAxisLabel: 'Hemoglobin O2 Saturation (SaO2 %)',
      baselineMarker: { label: 'Baseline P50 (26.6 mmHg)', value: 26.6 },
      targetMarkerLabel: 'Right-Shifted P50 (Acidosis)',
      extraNote: 'Sigmoidal shape reflects positive cooperativity among 4 heme subunits.'
    }
  }
];

export function getDailyPuzzleIndex(): number {
  // Deterministic daily puzzle from UTC day
  const msPerDay = 86_400_000;
  const daysSinceEpoch = Math.floor(Date.now() / msPerDay);
  return daysSinceEpoch % PUZZLES.length;
}

export function getPuzzleByIdOrIndex(identifier: string | number): PuzzleData {
  if (typeof identifier === 'number') {
    const idx = Math.abs(identifier) % PUZZLES.length;
    return PUZZLES[idx];
  }
  const found = PUZZLES.find(p => p.id === identifier);
  if (found) return found;
  const num = parseInt(identifier, 10);
  if (!isNaN(num)) {
    const idx = Math.abs(num) % PUZZLES.length;
    return PUZZLES[idx];
  }
  return PUZZLES[0];
}
