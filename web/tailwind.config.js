/**** Tailwind config ****/ 
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0B1B3B', 800: '#0F4C81' },
        accent: { cyan: '#007AFF' },
        risk: { red: '#E84C3D', orange: '#FFA629', green: '#2FB573' },
      },
      boxShadow: {
        card: '0 4px 16px rgba(16,24,40,0.08)',
        hover: '0 8px 24px rgba(16,24,40,0.12)',
      },
      borderRadius: { xl: '16px' },
      fontFamily: { sans: ['Inter', 'system-ui', 'ui-sans-serif'] },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
