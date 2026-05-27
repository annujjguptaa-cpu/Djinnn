/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        djinn: {
          bg: '#0a0a0f',
          surface: '#12121a',
          card: '#1a1a2e',
          purple: '#8b5cf6',
          'purple-dark': '#6d28d9',
          'purple-light': '#a78bfa',
          'purple-glow': '#7c3aed',
          text: '#e2e8f0',
          subtext: '#94a3b8',
          border: '#2d2d44',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'smoke': 'smoke 4s ease-in-out infinite',
        'particle': 'particle 1.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        smoke: {
          '0%': { opacity: '0', transform: 'translateY(0) scale(0.8)' },
          '30%': { opacity: '0.8', transform: 'translateY(-20px) scale(1.2)' },
          '100%': { opacity: '0', transform: 'translateY(-60px) scale(1.8)' },
        },
        particle: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-80px) scale(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #6d28d9, #8b5cf6, #a78bfa)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0f, #12121a)',
        'card-gradient': 'linear-gradient(135deg, #1a1a2e, #16213e)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 25%, rgba(139,92,246,0.15) 50%, transparent 75%)',
      },
      boxShadow: {
        'purple-glow': '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
        'purple-glow-lg': '0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.3)',
        'card': '0 4px 30px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
