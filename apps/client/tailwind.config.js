import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {},
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#F9F6F0",
          },
        },
        dark: {
          colors: {
            background: "#212121",
          },
        },
      },
    }),
  ],
};
