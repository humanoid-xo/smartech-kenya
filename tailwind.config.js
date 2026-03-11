/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#060F09',
          900: '#0D1F12',
          800: '#102A17',
          700: '#14381F',
          600: '#1A6B3A',
          500: '#1E8046',
          400: '#25A357',
          300: '#4DC87A',
        },
        cream: {
          DEFAULT: '#F5F0E8',
          warm:    '#EDE7D9',
          muted:   '#B8A99A',
          dark:    '#8A7B6E',
        },
        amber: {
          luxe:  '#C4902A',
          light: '#E0B84A',
          pale:  '#F5E8C0',
        },
        ink: {
          DEFAULT: '#0C0C0C',
          soft:    '#1A1A1A',
          muted:   '#3A3A3A',
          faint:   '#6B6B6B',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(3.5rem,8vw,7rem)', { lineHeight:'1.0', letterSpacing:'-0.03em' }],
        'display-xl':  ['clamp(2.5rem,5vw,4.5rem)', { lineHeight:'1.05', letterSpacing:'-0.025em' }],
        'display-lg':  ['clamp(2rem,4vw,3.2rem)', { lineHeight:'1.1', letterSpacing:'-0.02em' }],
        'display-md':  ['clamp(1.5rem,3vw,2.2rem)', { lineHeight:'1.15', letterSpacing:'-0.015em' }],
      },
      backgroundImage: {
        'forest-gradient': 'linear-gradient(135deg, #060F09 0%, #102A17 50%, #0D1F12 100%)',
        'cream-gradient':  'linear-gradient(180deg, #F5F0E8 0%, #EDE7D9 100%)',
        'amber-shimmer':   'linear-gradient(90deg, transparent 25%, rgba(196,144,42,0.12) 50%, transparent 75%)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)'    },
        },
        'line-grow': {
          from: { width: '0%' },
          to:   { width: '100%' },
        },
      },
      animation: {
        'fade-up':  'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        shimmer:    'shimmer 2s infinite',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
      },
    },
  },
  plugins: [],
};
