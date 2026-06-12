/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#0A0A14',
          soft:    '#1A1A2E',
          muted:   '#6B7280',
          faint:   '#9CA3AF',
        },
        cream: {
          DEFAULT: '#F8F9FB',
          warm:    '#F1F5F9',
        },
        blue: {
          DEFAULT: '#003A7A',
          mid:     '#0057B8',
          light:   '#E8F0FA',
        },
        accent: '#E8A020',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
