/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./src/**/*.{js,css}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Consolas", "Liberation Mono", "Menlo", "monospace"],
        display: ["Geist", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        border: "rgba(255, 255, 255, 0.1)",
        surface: "rgba(0, 0, 0, 0.3)",
      },
    },
  },
};
