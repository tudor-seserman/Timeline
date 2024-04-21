/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        OJ: "#FF4500",
        Yel: "#FFD700",
        Blu: "#87CEEB",
        Cora: "#FF7F50",
        Teal: "#008080",
        Highlight: "#FFA500",
      },
    },
  },
  plugins: [],
};
