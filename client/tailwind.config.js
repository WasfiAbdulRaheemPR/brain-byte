/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#142B4A',
          'navy-light': '#1E3A5F',
          teal: '#0F9D91',
          'teal-dark': '#0B7C72',
          'teal-light': '#E6F7F5',
          bg: '#F5F7FA',
          surface: '#FFFFFF',
          text: '#172B45',
          muted: '#64748B',
          border: '#E2E8F0',
          success: '#16A36A',
          warning: '#E9A23B',
          danger: '#DC5555',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'popover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
