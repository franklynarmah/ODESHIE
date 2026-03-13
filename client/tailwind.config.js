/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'odeshie': {
          'dark': '#3B1F0D',
          'brown': '#7B4A2D',
          'gold': '#C4952A',
          'beige': '#E8D5B7',
          'cream': '#FAF7F2',
        }
      },
      fontFamily: {
        'display': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'body': ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
