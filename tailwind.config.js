/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      spacing: {
        180: '180%',
      },
      borderRadius: {
        '4xl': '1.625rem',
      },
      transitionDuration: {
        5000: '5000ms',
      },
      maxHeight: {
        '50dvh': '50dvh',
      },
    },
  },
  plugins: [],
};
