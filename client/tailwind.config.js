/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY - Deep Plum 
        plum: {
          DEFAULT: '#6D214F',
          dark: '#56183D',
          light: '#8A2963',
          50: '#FBF4F7',
          100: '#F5E6ED',
          200: '#EDCEDD',
        },
        // SECONDARY - Soft Rose
        rose: {
          DEFAULT: '#E8A0BF',
          light: '#F4C8DC',
          soft: '#FFF0F5',
          muted: '#F2D0E3',
        },
        // BACKGROUND SYSTEM
        blush: {
          DEFAULT: '#FFF8FB',
          card: '#FFFFFF',
          border: '#F0E0EA',
          subtle: '#FBF4F7',
        },
        // TEXT SYSTEM
        tichi: {
          text: '#241A20',
          muted: '#756A70',
          faint: '#A89CA3',
          emergency: '#D92D20',
          success: '#168A5B',
          warning: '#B45309',
        },
        // SEMANTIC STATUS COLORS
        emergency: {
          DEFAULT: '#D92D20',
          bg: '#FFF1F0',
          border: '#FECACA',
          dark: '#B91C1C',
        },
        success: {
          DEFAULT: '#168A5B',
          bg: '#F0FDF4',
          border: '#BBF7D0',
        },
      },

      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.05em' }],
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['13px', { lineHeight: '18px' }],
        'base': ['14px', { lineHeight: '20px' }],
        'md': ['15px', { lineHeight: '22px' }],
        'lg': ['17px', { lineHeight: '24px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '38px' }],
      },

      borderRadius: {
        'sm': '8px',
        'control': '10px',
        'card': '16px',
        'container': '22px',
        'xl': '18px',
        '2xl': '24px',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      boxShadow: {
        'plum-subtle': '0 2px 12px -2px rgba(109, 33, 79, 0.07), 0 1px 4px -1px rgba(109, 33, 79, 0.04)',
        'plum-md': '0 4px 20px -2px rgba(109, 33, 79, 0.12)',
        'plum-lg': '0 8px 32px -4px rgba(109, 33, 79, 0.16)',
        'sos-idle': '0 0 0 8px rgba(217, 45, 32, 0.08), 0 4px 24px -4px rgba(217, 45, 32, 0.20)',
        'sos-glow': '0 0 24px 6px rgba(217, 45, 32, 0.22), 0 4px 20px -2px rgba(217, 45, 32, 0.30)',
        'sos-holding': '0 0 48px 12px rgba(217, 45, 32, 0.40), 0 8px 32px -2px rgba(217, 45, 32, 0.50)',
        'card': '0 1px 6px -1px rgba(36, 26, 32, 0.04), 0 2px 12px -2px rgba(36, 26, 32, 0.05)',
        'card-hover': '0 4px 20px -4px rgba(36, 26, 32, 0.10)',
        'modal': '0 20px 60px -10px rgba(36, 26, 32, 0.25)',
      },

      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'pulse-subtle': 'pulse 4s ease-in-out infinite',
        'radar': 'radar 2.4s ease-out infinite',
        'radar-delayed': 'radar 2.4s ease-out 1.2s infinite',
        'fade-up': 'fadeUp 0.35s ease-out both',
        'slide-in-bottom': 'slideInBottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'scale-in': 'scaleIn 0.25s ease-out both',
        'spin-slow': 'spin 3s linear infinite',
      },

      keyframes: {
        radar: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.0)', opacity: '0' },
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInBottom: {
          'from': { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
      },

      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      screens: {
        'xs': '375px',
        'sm': '430px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};
