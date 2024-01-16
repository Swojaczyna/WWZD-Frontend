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
        'uploadbutton': '0 0 25px 5px rgba(246, 203, 199, 0.3)',
        'canvas': 'inset 0px 50px 35px 10px rgba(17, 24, 39, 1), inset 0px -50px 35px 10px rgba(17, 24, 39, 1)',
      },
    },
  },
  plugins: [],
}

