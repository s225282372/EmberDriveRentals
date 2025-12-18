/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors - Red/Orange Ember Theme
        primary: {
          50: '#fef2f2',   // Lightest red tint
          100: '#fee2e2',  // Very light red
          200: '#fecaca',  // Light red
          300: '#fca5a5',  // Soft red
          400: '#f87171',  // Medium red
          500: '#ef4444',  // Base red (EmberDrive Red)
          600: '#dc2626',  // Strong red
          700: '#b91c1c',  // Dark red
          800: '#991b1b',  // Darker red
          900: '#7f1d1d',  // Darkest red
        },
        // Secondary Accent Colors - Orange
        accent: {
          50: '#fff7ed',   // Lightest orange tint
          100: '#ffedd5',  // Very light orange
          200: '#fed7aa',  // Light orange
          300: '#fdba74',  // Soft orange
          400: '#fb923c',  // Medium orange
          500: '#f97316',  // Base orange (Ember Orange)
          600: '#ea580c',  // Strong orange
          700: '#c2410c',  // Dark orange
          800: '#9a3412',  // Darker orange
          900: '#7c2d12',  // Darkest orange
        },
        // Dark/Gray Scale - For backgrounds and text
        dark: {
          50: '#fafafa',   // Almost white
          100: '#f5f5f5',  // Very light gray
          200: '#e5e5e5',  // Light gray
          300: '#d4d4d4',  // Medium-light gray
          400: '#a3a3a3',  // Medium gray
          500: '#737373',  // Gray
          600: '#525252',  // Dark gray
          700: '#404040',  // Darker gray
          800: '#262626',  // Very dark gray
          900: '#171717',  // Almost black
          950: '#0a0a0a',  // Pure black
        },
        // Success/Error/Warning/Info - Utility colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Base green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // Base red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Base amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Base blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      // Custom Gradient Colors
      backgroundImage: {
        'gradient-ember': 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
        'gradient-ember-dark': 'linear-gradient(135deg, #991b1b 0%, #9a3412 100%)',
        'gradient-ember-light': 'linear-gradient(135deg, #fca5a5 0%, #fdba74 100%)',
        'gradient-dark': 'linear-gradient(135deg, #171717 0%, #262626 100%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      // Custom Box Shadows
      boxShadow: {
        'ember': '0 4px 14px 0 rgba(220, 38, 38, 0.39)',
        'ember-lg': '0 10px 40px 0 rgba(220, 38, 38, 0.25)',
        'ember-xl': '0 20px 60px 0 rgba(220, 38, 38, 0.3)',
        'glow': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glow-lg': '0 0 40px rgba(239, 68, 68, 0.6)',
      },
      // Custom Animations
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      // Custom Font Families
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}