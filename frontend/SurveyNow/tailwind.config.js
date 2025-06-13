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
      },
      backgroundImage : {
        'auth-bg-img':"url('./src/assets/images/right_image.png')",
        'profile-bg--img': "url('./src/assets/images/profile-bg.png')",
      }

    },

  },
  plugins: [],
}

