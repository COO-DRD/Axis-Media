/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          void:  '#0A0A0B',
          deep:  '#0F0F11',
          base:  '#141417',
          lift:  '#1C1C21',
          edge:  '#27272E',
          muted: '#3A3A44',
        },
        axis: {
          gold:    '#C9A84C',
          'gold-dim': '#8A6B28',
          ice:     '#A8C5D8',
          ember:   '#E05C3A',
          signal:  '#4FFFB0',
          'signal-dim': '#1A7A4A',
        },
        lead: {
          low:  '#6B7280',
          mid:  '#C9A84C',
          high: '#4FFFB0',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'obsidian-grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        'gold-ray':       'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%)',
        'signal-ray':     'radial-gradient(ellipse 40% 30% at 80% 100%, rgba(79,255,176,0.07) 0%, transparent 60%)',
      },
      boxShadow: {
        'tactile-sm':  'inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.6)',
        'tactile-md':  'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)',
        'tactile-lg':  'inset 0 1px 0 rgba(255,255,255,0.1), 0 24px 64px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.6)',
        'glow-gold':   '0 0 24px rgba(201,168,76,0.3), 0 0 8px rgba(201,168,76,0.2)',
        'glow-signal': '0 0 20px rgba(79,255,176,0.25), 0 0 6px rgba(79,255,176,0.15)',
        'glow-ember':  '0 0 24px rgba(224,92,58,0.3)',
        'inner-gold':  'inset 0 0 20px rgba(201,168,76,0.08)',
        'inner-dim':   'inset 0 0 0 1px rgba(255,255,255,0.06)',
      },
      animation: {
        'fade-up':    'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in':    'fadeIn 0.5s ease both',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
        'scan':       'scan 4s linear infinite',
        'drift':      'drift 20s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp:    { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        pulseGold: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        scan:      { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(400%)' } },
        drift:     { from: { transform: 'translate(0,0) rotate(0deg)' }, to: { transform: 'translate(40px,20px) rotate(3deg)' } },
      },
      transitionTimingFunction: {
        'axis': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
