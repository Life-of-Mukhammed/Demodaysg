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
        // startupgarage.uz palette — only TWO brand colors: one purple, one dark
        sg: {
          purple: '#5E3EFF',
          'purple-light': '#5E3EFF',
          'purple-dark': '#5E3EFF',
          dark: '#0A0E2E',
          'dark-card': '#0A0E2E',
          ink: '#0A0E2E',
        },
        navy: {
          50: '#EEF0FF',
          100: '#5E3EFF',
          200: '#5E3EFF',
          300: '#5E3EFF',
          400: '#5E3EFF',
          500: '#5E3EFF',
          600: '#5E3EFF',
          700: '#0A0E2E',
          800: '#0A0E2E',
          900: '#0A0E2E',
          950: '#0A0E2E',
        },
        electric: {
          DEFAULT: '#5E3EFF',
          50: '#EEF0FF',
          100: '#5E3EFF',
          200: '#5E3EFF',
          300: '#5E3EFF',
          400: '#5E3EFF',
          500: '#5E3EFF',
          600: '#5E3EFF',
        },
        success: {
          DEFAULT: '#3FE078',
          50: '#E6FBEE',
          100: '#C2F5D5',
          200: '#88EBA9',
          300: '#3FE078',
          400: '#23C95F',
          500: '#1AA84E',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #5E3EFF 0%, #5E3EFF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0E2E 0%, #0A0E2E 100%)',
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
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        twinkle: 'twinkle 4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
