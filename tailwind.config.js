/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#ffffff",
        accent: "#999999"
      },
      fontFamily: {
        heading: ['"Bebas Neue"', '"Anton"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
