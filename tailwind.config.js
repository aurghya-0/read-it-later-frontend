/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.{js,css}",
    "./views/**/*.ejs",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/aspect-ratio')
  ],
}

