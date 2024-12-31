/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  mode: 'jit', // Just-in-time compilation mode for faster builds.
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};