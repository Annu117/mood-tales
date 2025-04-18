/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#B181E7',
      },
      keyframes: {
        verticalMove: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        verticalMove: 'verticalMove 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

