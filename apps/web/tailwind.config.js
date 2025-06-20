/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      'display': ['Inter', 'ui-sans-serif', 'system-ui'],
      'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
    },
    extend: {
      boxShadow: {
        "xl-glow": "0 6px 32px 0 #a21caf55, 0 0px 8px 2px #f472b666",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ],
};