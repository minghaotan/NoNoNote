/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          'SF Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'Courier New',
          'monospace'
        ],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
      },
      colors: {
        paper: '#f2f0e9', // Vintage paper
        ink: '#1a1a1a',   // Dark ink
        'ink-light': '#4a4a4a',
        accent: '#ff5252', // Retro Red
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px rgba(26, 26, 26, 1)',
        'retro-sm': '2px 2px 0px 0px rgba(26, 26, 26, 1)',
      }
    }
  },
  plugins: [],
}
