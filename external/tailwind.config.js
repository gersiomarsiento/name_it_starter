//@ts-check

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.js', '../**/*.liquid'],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-body-family)'],
        headings: ['var(--font-heading-family)'],
      },
      maxWidth: {
        desk: '1440px',
        wide: '1920px',
        'xl-wide': '2500px',
      },
      screens: {
        tiny: '330px',
        'tiny-down': { max: '329px' },
        xs: '375px',
        'xs-down': { max: '374px' },
        sm: '480px',
        'sm-down': { max: '479px' },
        sm2: '580px',
        'sm2-down': { max: '579px' },
        sm3: '680px',
        'sm3-down': { max: '679px' },
        md: '768px',
        'md-down': { max: '767px' },
        'only-md': { min: '768px', max: '1023px' },
        lg: '1024px',
        'lg-down': { max: '1023px' },
        xl: '1280px',
        'xl-down': { max: '1279px' },
        desktop: '1441px',
        'desktop-down': { max: '1440px' },
      },
      colors: {
        primary: '#1fb6ff',
        secondary: '#7e5bef',
      },
      gridTemplateColumns: {
        13: 'repeat(13, minmax(0, 1fr))',
        14: 'repeat(14, minmax(0, 1fr))',
        15: 'repeat(15, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
        17: 'repeat(17, minmax(0, 1fr))',
        18: 'repeat(18, minmax(0, 1fr))',
        19: 'repeat(19, minmax(0, 1fr))',
        20: 'repeat(20, minmax(0, 1fr))',
        '150px': 'repeat(auto-fill, minmax(min(150px, 100%), 1fr))',
        '200px': 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
        '250px': 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))',
        '300px': 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
        '350px': 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))',
        '400px': 'repeat(auto-fill, minmax(min(400px, 100%), 1fr))',
      },
      fontSize: {},
      spacing: {},
    },
  },
  plugins: [],
};
