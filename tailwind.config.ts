import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#6993A5',
          100: '#618CA0',
          200: '#577C91',
          300: '#4D6C81',
          400: '#445C71',
          500: '#3A4D61',
          600: '#303F51',
          700: '#273241',
          800: '#1D2531',
          900: '#141821',
          950: '#0F1219',
        },
      },
    },
  },
  plugins: [],
};

export default config;
