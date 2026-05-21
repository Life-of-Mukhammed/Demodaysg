import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', md: '2rem' },
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brand: {
          50: '#fdf7f0',
          100: '#faecda',
          200: '#f5d6b0',
          300: '#eeb87d',
          400: '#e69654',
          500: '#df7a35',
          600: '#c95830',
          700: '#a64228',
          800: '#853625',
          900: '#6c2e21',
          950: '#3a160e',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-mesh':
          'radial-gradient(at 27% 37%, hsla(38, 92%, 75%, 0.35) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(16, 75%, 70%, 0.25) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(28, 80%, 80%, 0.25) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(45, 88%, 78%, 0.25) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(20, 90%, 75%, 0.25) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(40, 70%, 80%, 0.2) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(12, 85%, 78%, 0.2) 0px, transparent 50%)',
        'gradient-brand':
          'linear-gradient(135deg, #c95830 0%, #df7a35 50%, #eeb87d 100%)',
        'gradient-warm':
          'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #c95830 100%)',
        'gradient-glow':
          'linear-gradient(135deg, rgba(201, 88, 48, 0.12), rgba(245, 158, 11, 0.12))',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
