/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pomodoro: {
          primary: '#ef4444',
          secondary: '#f87171',
          light: '#fef2f2',
          dark: '#dc2626'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-gentle': 'bounce 1s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      scale: {
        '102': '1.02',
        '105': '1.05',
      }
    },
  },
  plugins: [],
}