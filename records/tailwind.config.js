/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5F6FFF",
        'blue-purple': {
          100: '#a5b4fc',
          200: '#818cf8',
          300: '#6366f1',
          400: '#4f46e5',
          500: '#4338ca',
          600: '#3730a3',
          700: '#312e81',
          800: '#2e2a6e',
          900: '#1e1b4b',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    backgroundClip: true, // Ensure this is enabled for gradient text
  },
};