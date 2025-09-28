// client/tailwind.config.cjs
const { error } = require('console')
const palette = require('./src/design/palette')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: palette.neutral,
        white: palette.white,
        black: palette.black,
        primary: {
          DEFAULT: palette.primary,
          weak:   palette['primary-weak'],
        },

        stroke: palette.stroke,
        error: palette.error,

        background: palette.background,

        foreground: palette.foreground,
        outline: palette.outline,
        btn: palette.btn,
        text: palette.text,
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [],
}
