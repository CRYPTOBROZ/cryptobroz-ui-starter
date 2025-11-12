import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'black-ops': ['var(--font-black-ops)', 'Impact', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        dark: {
          primary: '#6A1B9A',
          'primary-content': '#ffffff',
          secondary: '#00BCD4',
          'secondary-content': '#ffffff',
          accent: '#FFB300',
          'accent-content': '#212121',
          neutral: '#212121',
          'neutral-content': '#F5F5F5',
          'base-100': '#1a1a1a',
          'base-200': '#2d2d2d',
          'base-300': '#424242',
          'base-content': '#F5F5F5',
          info: '#00BCD4',
          success: '#E91E63',
          warning: '#FFB300',
          error: '#E91E63',
        },
        light: {
          primary: '#6A1B9A',
          'primary-content': '#ffffff',
          secondary: '#00BCD4',
          'secondary-content': '#ffffff',
          accent: '#FFB300',
          'accent-content': '#212121',
          neutral: '#F5F5F5',
          'neutral-content': '#212121',
          'base-100': '#ffffff',
          'base-200': '#F5F5F5',
          'base-300': '#E0E0E0',
          'base-content': '#212121',
          info: '#00BCD4',
          success: '#E91E63',
          warning: '#FFB300',
          error: '#E91E63',
        },
      },
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
  },
};

export default config;
