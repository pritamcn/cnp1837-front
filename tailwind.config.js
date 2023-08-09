/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
    // extend: {
    //   backgroundImage: {
    //     'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    //     'gradient-conic':
    //       'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    //   },
    // },
    fontFamily: {
      sans: ['Roboto'],
      serif: ['serif'],
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#125ECB',
          secondary: '#001725',
          accent: '#00337C',
          neutral: '#515562',
          'base-100': '#F4F6F8',
          'base-200': '#9A98A8',
          'base-300': '#E3E3E3',
          info: '#E3EFFF',
          error: '#CB0000',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
