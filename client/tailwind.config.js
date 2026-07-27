/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. PRIMARY - Midnight Amethyst (Antique Imperial Purple)
        plum: {
          DEFAULT: '#26123D',
          dark: '#170A28',
          light: '#3D1F61',
          50: '#F7F3FC',
          100: '#EFE5FA',
          200: '#D6C0F3',
        },
        // 2. SECONDARY - Electric Coral Rose (Modern Vibrant Safety Accent)
        rose: {
          DEFAULT: '#FF3B70',
          light: '#FF6B95',
          soft: '#FFF0F5',
          muted: '#FFC2D4',
        },
        // 3. HIGHLIGHT - Cyber Gold (Antique Super Admin & Elite Status)
        gold: {
          DEFAULT: '#FFD166',
          dark: '#E5AB1C',
          light: '#FFE6A3',
          soft: '#FFF9E6',
        },
        // BACKGROUND SYSTEM
        blush: {
          DEFAULT: '#FAF6FD',
          card: '#FFFFFF',
          border: '#EADAFA',
          subtle: '#F6EFFC',
        },
        // TEXT SYSTEM
        tichi: {
          text: '#1E122B',
          muted: '#6C5D7C',
          faint: '#A092B0',
          emergency: '#E62E5C',
          success: '#10B981',
          warning: '#F59E0B',
        },
        // SEMANTIC STATUS COLORS
        emergency: {
          DEFAULT: '#E62E5C',
          bg: '#FFF0F3',
          border: '#FECDD3',
          dark: '#BE123C',
        },
        success: {
          DEFAULT: '#10B981',
          bg: '#ECFDF5',
          border: '#A7F3D0',
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

      boxShadow: {
        'plum-subtle': '0 2px 12px -2px rgba(38, 18, 61, 0.08), 0 1px 4px -1px rgba(38, 18, 61, 0.04)',
        'plum-md': '0 6px 24px -2px rgba(38, 18, 61, 0.15)',
        'plum-lg': '0 12px 36px -4px rgba(38, 18, 61, 0.22)',
        'coral-glow': '0 0 28px 4px rgba(255, 59, 112, 0.35)',
        'gold-glow': '0 0 28px 4px rgba(255, 209, 102, 0.40)',
        'sos-idle': '0 0 0 8px rgba(230, 46, 92, 0.10), 0 4px 24px -4px rgba(230, 46, 92, 0.25)',
        'sos-glow': '0 0 30px 8px rgba(230, 46, 92, 0.30), 0 4px 20px -2px rgba(230, 46, 92, 0.40)',
        'sos-holding': '0 0 50px 16px rgba(230, 46, 92, 0.50), 0 8px 32px -2px rgba(230, 46, 92, 0.60)',
        'card': '0 2px 8px -1px rgba(30, 18, 43, 0.05), 0 4px 16px -2px rgba(30, 18, 43, 0.04)',
        'card-hover': '0 8px 28px -4px rgba(30, 18, 43, 0.12)',
        'modal': '0 24px 64px -12px rgba(18, 8, 36, 0.35)',
      },

      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'pulse-subtle': 'pulse 4s ease-in-out infinite',
        'radar': 'radar 2.4s ease-out infinite',
        'fade-up': 'fadeUp 0.35s ease-out both',
        'slide-in-bottom': 'slideInBottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'scale-in': 'scaleIn 0.25s ease-out both',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        'shield-pulse': 'shieldPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },

      keyframes: {
        radar: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.0)', opacity: '0' },
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(12px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInBottom: {
          'from': { opacity: '0', transform: 'translateY(24px) scale(0.97)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.94)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shieldPulse: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 12px rgba(255, 59, 112, 0.4))' },
          '50%': { transform: 'scale(1.05)', filter: 'drop-shadow(0 0 24px rgba(255, 209, 102, 0.7))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
