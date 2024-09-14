/** @type {import('tailwindcss').Config} */
export default {
  content: ['./resources/**/*.edge', './inertia/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
    },
  },
  plugins: [],
}
