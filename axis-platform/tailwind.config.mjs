/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          deep:  '#071209', dark: '#0A1A0E', base: '#0E2214',
          lift:  '#1A3D22', mid: '#225230', edge: '#2D6B3F',
        },
        gold:   { DEFAULT: '#C9A84C', dim: 'rgba(201,168,76,0.15)' },
        signal: { DEFAULT: '#4FFFB0' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
