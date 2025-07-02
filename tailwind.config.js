/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      'sm': '480px',
      'md': '768px',
      'lg': '1024px'
    },
    fontSize: {
      "xs": ".75rem",
      "sm": ".875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.9rem",
      "4xl": "2.2rem",
      "5xl": "2.5rem"
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
