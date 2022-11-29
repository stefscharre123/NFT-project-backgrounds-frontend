/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
      extend: {
        // backgroundImage: {
        //   'bg-image' : "url('/background.jpg')",
        // }
      },
      fontFamily: {
        'sans': ['ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      },
      backgroundPosition: {
      'left-4': 'center left 1rem',
      }
  },
  plugins: [],
}

