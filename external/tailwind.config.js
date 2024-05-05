//@ts-check

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.js', '../**/*.liquid'],
  theme: {
    extend: {
      fontSize: {
        // desktop - mobile
        button: [
          '1.6rem',
          {
            lineHeight: 1,
            fontWeight: 400,
          },
        ],
      },
      fontWeight: {
        250: '250',
      },
      colors: {
        'green-dark': '#3E4929',
        'green-medium': '#747C51',
        'green-bright': '#959500',
        'orange-burnt': '#A07500',
        olive: '#7A7A00',
        sand: '#CCC4A7',
        'sand-light': '#EDE8DD',
        red: '#C82E22',
        black: '#221F1F',
        white: '#FFFFFF',
        overlay: '#C0E0FF',
        grey: '#A8ABAD',
        dark_grey: '#6D7278',
        'black-full': '#000000',
      },
      spacing: {},
      scale: {
        110: '1.10',
      },
    },
  },
  plugins: [],
};
