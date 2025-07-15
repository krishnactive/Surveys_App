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
        'auth-bg-img':"url('https://res.cloudinary.com/de3dlsov2/image/upload/v1752594210/image_bg_lg_u8qtof.png')",
        'profile-bg--img': "url('https://res.cloudinary.com/de3dlsov2/image/upload/v1752570337/uploads/ssyqntviegtvuanbctqd.png')",
      }

    },

  },
  plugins: [],
}

