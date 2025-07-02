/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        fadeInComic: 'fadeInComic 0.3s forwards',
        pageTurn: 'pageTurn 1s forwards',
        bounce: 'bounce 2s infinite',
      },
      keyframes: {
        fadeInComic: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pageTurn: {
          '0%': { transform: 'perspective(1000px) rotateY(0deg)' },
          '50%': {
            transform: 'perspective(1000px) rotateY(-90deg)',
            opacity: '0.5',
          },
          '51%': { opacity: '0' },
          '100%': {
            transform: 'perspective(1000px) rotateY(-180deg)',
            opacity: '1',
          },
        },
      },
    },
    // plugins; [
    //   require('@tailwindcss/forms'), // Optional
    // ]
  },
}
