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
        'auth-bg-img':"url('https://res.cloudinary.com/de3dlsov2/image/upload/v1752578972/uploads/qlhbvxq2s7ecxwhcxdn5.png')",
        'profile-bg--img': "url('https://res.cloudinary.com/de3dlsov2/image/upload/v1752570337/uploads/ssyqntviegtvuanbctqd.png')",
      }

    },

  },
  plugins: [],
}

