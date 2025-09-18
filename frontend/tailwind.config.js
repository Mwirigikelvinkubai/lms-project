/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], 
  theme: {
    extend: {
      colors: {
        mohi: {
          blue: "#26A9E0",
          green: "#8BC53F",
          navy: "#002F66",
          orange: "#FF7400",
          yellow: "#FFBB00",
        },
      },
      fontFamily: {
        body: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
