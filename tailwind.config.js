/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./_output/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
