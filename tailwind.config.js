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
        industrial: {
          950: '#070b12',
          900: '#0c121e',
          850: '#111a2c',
          800: '#17223b',
          700: '#233355',
          600: '#344b7a',
          500: '#4d6ba8',
          400: '#728ec7',
          300: '#9eb4e2',
          200: '#cbd7f3',
          100: '#e8eefa',
          50: '#f4f7fd',
        },
        truth: {
          blue: '#1e88e5',
          amber: '#f59e0b',
          emerald: '#10b981',
          rose: '#f43f5e',
          cyan: '#06b6d4',
          indigo: '#6366f1',
        }
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant('light', '.light &');
    }
  ],
}
