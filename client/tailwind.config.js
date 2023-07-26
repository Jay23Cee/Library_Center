/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "325px",
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1280px",
      },
      fontFamily: {
        courier: ["Courier New Bold", " arial"],
        courierRegular: ["Courier New", "arial"],
      },
      colors: {
        main: {
          primary :"#006ba6",// Dark Cyan
          secondary :"#ff9b05",// Orange
          lightblue: "#0496ff",// Deep Sky Blue
          navyblue: "#0c2440",// Navy Blue
          accent :"#ffbc42",// Selective Yellow
          highlight :"#d39177",// Dusty Salmon
        },
        green: {
          off: "#7dcfb6",
        },
        white: {
          main: "#ffffff",
          off: "#e5e5e5",
        },
        blue: {
          main: "#1d4e89",
          off: "#00b2ca",
        },
      },
    },
  },
  plugins: [],
};
