# OneMCATperday, One MCAT Biology Puzzle a Day

> A zero-backend daily biology puzzle web application @ 

<img width="1512" height="855" alt="Screenshot 2026-11-20 at 23 54 57" src="https://github.com/user-attachments/assets/dfd69a59-46c2-4515-a000-dfef75553313" />

Built with **React 18 + TypeScript + Vite + Tailwind CSS**.

---

## 🔬 Features & Architecture

### 1. Visual Aesthetic & Retro Laboratory Atmosphere
- **Full-Bleed Dark Navy Room:** `#071029` / `#0a1638` tones with tall side windows glowing with muted yellow-green bioluminescent/moonlit ambient light.
- **Crisp Pixel Art Scaling:** Procedural low-res pixel canvas rendered with `image-rendering: pixelated; image-rendering: crisp-edges;`.
- **Atmospheric Details:**
  - Tiled floor perspective lines converging toward a vanishing horizon.
  - Vintage rotary telephone resting on the right floor (click to trigger ring animation).
  - White pixel-art researcher creature peeking through the open doorway on the far left.
  - Laboratory workbench along the bottom equipped with glowing test tubes.
  - Optional CRT scanline raster overlay toggle in the header.
- **Typography:** Retro pixel display font `Silkscreen` / `VT323` paired with `JetBrains Mono` for data and scientific values.

### 2. Core Gameplay Loop
- **Punchy Prompts:** Every prompt is 1–2 short sentences (~15–25 words) designed to be read and solved in under 30 seconds.
- **Two-Phase Interactive Mechanics:**
  1. **Prediction Phase:** Students drag markers along quantitative axes or select biological nodes with live candidate readouts and keyboard arrow control.
  2. **Revealed / Solution Phase:** Answers are locked, highlighting the exact biological target on the diagram in soft yellow-green.
     - **Verdict:** `"Spot on."`, `"Close enough."`, or `"Not quite."` with tolerance grading.
     - **1-Sentence Takeaway:** Core conceptual summary.
     - **"Why?" Mechanism Drawer:** Concise 2–3 sentence high-yield MCAT explanation focusing on first principles.
     - **"Send to a friend":** Copies formatted score and URL directly to clipboard.

### 3. Comprehensive High-Yield MCAT Biology Puzzles
1. **Enzyme Kinetics (Competitive Inhibition):** Predicting apparent $K_m$ shift without altering $V_{max}$ on a Michaelis-Menten hyperbolic plot.
2. **Renal Physiology (Osmolarity & ADH):** Countercurrent multiplication and medullary collecting duct equilibration at $1200\text{ mOsm/L}$.
3. **Metabolic Regulation (Glycerol-3-Phosphate Shuttle):** Calculating net ATP yield per glucose ($30\text{ ATP}$) when cytosolic NADH enters Complex II via FADH₂.
4. **Neurobiology (Nernst-Goldman Potential):** Predicting the depolarized resting membrane potential ($V_m \approx -53\text{ mV}$) upon extracellular hyperkalemia ($[K^+]_{out} = 8.0\text{ mM}$).
5. **Genetics (Hardy-Weinberg Carrier Frequency):** Estimating carrier frequency ($2pq \approx 1.98\%$) from rare disease incidence ($q^2 = 0.0001$).
6. **Cell Cycle & Oncology (p53 / G1 Checkpoint):** Identifying the CDK4/6-Cyclin D & CDK2-Cyclin E complex targeted by p21 to prevent Rb phosphorylation.
7. **Molecular Genetics (Lac Operon Mutation):** Predicting constitutive transcription caused by nonsense mutation in $lacI$.
8. **Respiratory Physiology (Hemoglobin Bohr Effect):** Predicting the right-shifted $P_{50}$ ($36\text{ mmHg}$) during acidosis and hyperthermia.

### 4. Zero-Backend Daily Rotation & LocalStorage Persistence
- **Deterministic Daily Rotation:** Determined via UTC day calculation:
  ```ts
  Math.floor(Date.now() / 86_400_000) % PUZZLES.length
  ```
- **URL Query Override:** Use `?puzzle=0`, `?puzzle=1`, etc., to preview and test any puzzle.
- **Persistence:** Submissions, verdicts, user predictions, and `Why?` drawer expansion states are automatically persisted in `localStorage`.
- **Archive Drawer:** Browse all puzzles, track solved states, and clear progress at any time.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run
```bash
# Navigate to the project directory
cd /Users/wong/.gemini/antigravity/scratch/first-principles-bio

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```
