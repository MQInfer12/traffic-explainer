import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "rgb(0,0,0)",
        white: "rgb(255,255,255)",
        accent: "rgb(255,255,255)",
        gray: colors.gray,
        primary: colors.amber,
      },
    },
  },
  plugins: [],
};
