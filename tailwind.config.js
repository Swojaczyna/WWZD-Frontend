/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'leftbutton': '-120px 0 100px 100px rgba(246, 203, 199, 0.3)',
        'rightbutton': '120px 0 100px 100px rgba(246, 203, 199, 0.3)',
      },
    },
  },
  plugins: [],
}

