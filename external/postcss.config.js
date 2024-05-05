module.exports = {
  plugins: [
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano'),
    require('postcss-import'),
    require('postcss-preset-env')({
      stage: 1,
    })
  ]
  // plugins: {
  //   'cssnano': {},
  //   'tailwindcss/nesting': {},
  //   tailwindcss: {},
  //   autoprefixer: {},
  // },
};
