/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0a',
        'cyber-dark-secondary': '#1a1a2e',
        'cyber-blue': '#00f0ff',
        'cyber-pink': '#ff00ff',
        'cyber-green': '#00ff41',
        'cyber-purple': '#8b00ff',
      },
      boxShadow: {
        'cyber-blue': '0 0 20px #00f0ff, 0 0 40px #00f0ff, 0 0 60px #00f0ff',
        'cyber-pink': '0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #ff00ff',
        'cyber-green': '0 0 20px #00ff41, 0 0 40px #00ff41, 0 0 60px #00ff41',
        'cyber-glow': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'slide-in': 'slide-in 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { opacity: '0.8', filter: 'brightness(1)' },
          '100%': { opacity: '1', filter: 'brightness(1.2)' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

