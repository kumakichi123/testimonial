/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: { primary: "#4a90e2", "light-gray": "#e0e0e0" },
    },
  },
  plugins: [], // line-clampを使うなら: [require("@tailwindcss/line-clamp")]
};
