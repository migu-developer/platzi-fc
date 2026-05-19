import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Platzi FC brand colors
        club: {
          primary: '#1B4332',
          'primary-light': '#2D6A4F',
          secondary: '#D4AF37',
          'secondary-light': '#E8C547',
          dark: '#0B1D14',
          light: '#F5F5F0',
          accent: '#95D5B2',
        },
        // Semantic colors
        pitch: {
          green: '#1B4332',
          line: '#FFFFFF',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '0.75rem',
      },
    },
  },
}

export default config
