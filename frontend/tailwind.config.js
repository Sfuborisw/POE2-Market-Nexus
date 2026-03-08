/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        poe_dark: "#0f0f0f",
        poe_gold: "#c8a165",
        poe_border: "#2a2a2a",
      },
    },
  },
  plugins: [],
};
