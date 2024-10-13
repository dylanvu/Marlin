module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      fontFamily: {
        'azo-sans-uber': ['"azo-sans-uber"', 'sans-serif'],
      },
    },
  },
  prefix: '',
  plugins: [],
}
