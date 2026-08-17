/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        silver: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#d0d0d0',
          400: '#b0b0b0',
          500: '#999999',
          600: '#808080',
          700: '#666666',
          800: '#4d4d4d',
          900: '#333333',
        },
        gold: {
          50: '#fef9f3',
          100: '#fdf2e9',
          200: '#fce5cc',
          300: '#fbd8b0',
          400: '#f9bb70',
          500: '#f7a938',
          600: '#e59a2b',
          700: '#cc8721',
          800: '#b3751f',
          900: '#8a5a1a',
        },
      },
    },
  },
  plugins: [],
}
