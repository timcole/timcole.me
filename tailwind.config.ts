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
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#141a24',
          800: '#0f141d',
          900: '#0C1017',
        },
        secondary: {
          50: '#61bdfe',
          100: '#57b3f4',
          200: '#4da9ea',
          300: '#439fe0',
          400: '#3995d6',
          500: '#2f8bcc',
          600: '#2581c2',
          700: '#1b77b8',
          800: '#116dae',
          900: '#0763a4',
        },
      },
    },
  },
  plugins: [],
};
export default config;
