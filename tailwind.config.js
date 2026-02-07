/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2e6',
          100: '#cce6cc',
          200: '#99cc99',
          300: '#66b366',
          400: '#339933',
          500: '#006400', // Kenyan green
          600: '#005000',
          700: '#003c00',
          800: '#002800',
          900: '#001400',
        },
        accent: {
          50: '#fce7eb',
          100: '#f9cfd7',
          200: '#f39faf',
          300: '#ed6f87',
          400: '#e73f5f',
          500: '#C8102E', // Kenyan red
          600: '#a00d25',
          700: '#780a1c',
          800: '#500712',
          900: '#280309',
        },
        neutral: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#BABABA',
          400: '#A3A3A3',
          500: '#8C8C8C',
          600: '#757575',
          700: '#5E5E5E',
          800: '#474747',
          900: '#303030',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
