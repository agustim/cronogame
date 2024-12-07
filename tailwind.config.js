/** @type {import('tailwindcss').Config} */
const konstaConfig = require('konsta/config')

module.exports = konstaConfig({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
  konsta: {
    colors: {
      'button-green': '#059669',
      'button-gray': '#475569'
    }
  },
});
