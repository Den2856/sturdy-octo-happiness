/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0D1217",
        primary: "#1DE782",
        "primary-weak": "#C8F7E2",
        "btn-hover": "#16d36f",
        "btn-red": "#E11D1D",
        "outline-default": "rgba(255,255,255,0.12)",
        "foreground-d": "#D5E1F5"
      }
    }
  },
  plugins: []
};
