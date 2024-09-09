/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/react-tailwindcss-datepicker/dist/index.esm.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto Mono', 'monospace'],
      },
    },
  },
  daisyui: {
    themes: ['coffee'],
  },
  plugins: [require('daisyui')],
  safelist: [{ pattern: /(bg|text|border)-./ }],
  darkMode: 'off',
};
