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
          primary: "#fbd1a2", // Pale Orange
          secondary: "#ffffff", // White
          accent: "#f7a58d", // Light Coral
          highlight: "#d39177", // Dusty Salmon
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
