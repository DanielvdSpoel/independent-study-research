/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      aria: {
        incorrect: 'answer-correct="false"',
        correct: 'answer-correct="true"',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),

  ],
}
