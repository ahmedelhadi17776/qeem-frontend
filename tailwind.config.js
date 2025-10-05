/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Qeem Brand Colors
        primary: {
          DEFAULT: '#1A2B48', // q-navy-deep
        },
        accent: {
          DEFAULT: '#22C55E', // q-green-growth
          dark: '#16A34A',    // q-green-dark
        },
        // Semantic Colors
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        success: '#22C55E',
        // Text Colors (light mode values)
        'text-main': '#1A2B48',
        'text-body': '#334155',
        'text-muted': '#64748B',
        // Background Colors (light mode values)
        bg: '#F1F5F9',
        surface: '#FFFFFF',
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Liberation Mono', 'Menlo', 'Courier', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],    // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        base: ['1rem', { lineHeight: '1.5rem' }],    // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],   // 24px
        '3xl': ['2rem', { lineHeight: '2.25rem' }],  // 32px
        '4xl': ['2.5rem', { lineHeight: '2.5rem' }], // 40px
        '5xl': ['3rem', { lineHeight: '1' }],        // 48px
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      spacing: {
        xs: '0.25rem',  // 4px
        sm: '0.5rem',   // 8px
        md: '1rem',     // 16px
        lg: '1.5rem',   // 24px
        xl: '2rem',     // 32px
        '2xl': '3rem',  // 48px
        '3xl': '4rem',  // 64px
        '70': '17.5rem', // 280px for sidebar
        '18': '4.5rem',  // 72px for mobile nav height
      },
      boxShadow: {
        sm: '0 1px 2px rgba(26, 43, 72, 0.05)',
        DEFAULT: '0 4px 12px rgba(26, 43, 72, 0.08)',
        md: '0 4px 12px rgba(26, 43, 72, 0.08)',
        lg: '0 8px 24px rgba(26, 43, 72, 0.12)',
        xl: '0 16px 48px rgba(26, 43, 72, 0.16)',
        glow: '0 0 20px rgba(34, 197, 94, 0.3)',
        'sm-dark': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'md-dark': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'lg-dark': '0 8px 24px rgba(0, 0, 0, 0.5)',
        'xl-dark': '0 16px 48px rgba(0, 0, 0, 0.6)',
      },
      borderRadius: {
        sm: '0.5rem',   // 8px
        DEFAULT: '0.75rem', // 12px
        md: '0.75rem',  // 12px
        lg: '1rem',     // 16px
        xl: '1.25rem',  // 20px
        full: '9999px',
      },
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '250ms',
        slow: '350ms',
      },
      transitionTimingFunction: {
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      zIndex: {
        base: '1',
        dropdown: '100',
        sticky: '200',
        modal: '500',
        popover: '600',
        tooltip: '700',
        toast: '800',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
