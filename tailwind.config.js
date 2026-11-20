/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040918',
          900: '#071029',
          850: '#0a1638',
          800: '#0e1d49',
          700: '#14275f',
          600: '#1e3880',
        },
        retro: {
          lime: '#a3e635',
          paleLime: '#bef264',
          glowGreen: '#86efac',
          windowGlow: '#a8d96f',
          terminalGreen: '#4ade80',
          yellowGlow: '#fef08a',
          amber: '#fbbf24',
          brick: '#f87171',
          slate: '#334155',
          border: '#1e293b',
          phoneBeige: '#d6cbba',
        }
      },
      fontFamily: {
        pixel: ['"Silkscreen"', '"VT323"', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        vt: ['"VT323"', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 15px -3px rgba(163, 230, 53, 0.45)',
        'glow-window': '0 0 40px 10px rgba(168, 217, 111, 0.25)',
        'pixel': '2px 2px 0 0 #000, -2px -2px 0 0 #000, 2px -2px 0 0 #000, -2px 2px 0 0 #000',
      }
    },
  },
  plugins: [],
}
