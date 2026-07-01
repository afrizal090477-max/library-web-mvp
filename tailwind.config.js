/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Quicksand", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Display Scale (dari Figma)
        'display-3xl': ['56px', { lineHeight: '68px', letterSpacing: '-0.02em' }],
        'display-2xl': ['48px', { lineHeight: '60px', letterSpacing: '-0.02em' }],
        'display-xl': ['40px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
        'display-lg': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em' }],
        'display-md': ['32px', { lineHeight: '42px', letterSpacing: '-0.02em' }],
        'display-sm': ['28px', { lineHeight: '38px', letterSpacing: '-0.02em' }],
        'display-xs': ['24px', { lineHeight: '36px', letterSpacing: '-0.02em' }],

        // Text Scale
        'text-xl': ['20px', { lineHeight: '34px' }],
        'text-lg': ['18px', { lineHeight: '30px' }],
        'text-md': ['16px', { lineHeight: '30px' }],
        'text-sm': ['14px', { lineHeight: '24px' }],
        'text-xs': ['12px', { lineHeight: '20px' }],
      },
      colors: {
        'ds-dark': '#252B37',
        'ds-black': '#0A0D12',
        'ds-surface': '#FDFDFD',
        'ds-bg': '#F5F5F5',
        'ds-gray': '#535862',
      },
    },
  },
  plugins: [],
}