/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#84CC16",
        secondary: "#06b6d4"
      }
    },
  },
  plugins: [],
}

