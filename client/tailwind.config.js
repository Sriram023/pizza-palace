/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#1a1a1a',
        cream: '#fef9f4',
        brand: {
          DEFAULT: '#e63946',
          50: '#fff1f2',
          100: '#ffe1e3',
          500: '#e63946',
          600: '#c92a37',
          700: '#a31f2b',
        },
        accent: {
          DEFAULT: '#ff6b35',
          500: '#ff6b35',
          600: '#e85a25',
        },
      },
      boxShadow: {
        card: '0 4px 20px -8px rgba(26,26,26,0.18)',
        glow: '0 10px 30px -10px rgba(230,57,70,0.45)',
      },
    },
  },
  plugins: [],
};