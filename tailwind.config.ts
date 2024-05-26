import defaultTheme from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';
import formsPlugin from '@tailwindcss/forms';
import kobaltePlugin from '@kobalte/tailwindcss';
import typographyPlugin from '@tailwindcss/typography';
import { screens } from './ui/src/constants/screens';

export default {
  content: ['./ui/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      screens,
      fontFamily: {
        serif: ['Lora', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        gray: colors.stone,
      },
      width: {
        sidebar: '16rem',
      },
      keyframes: {
        'overlay-show': { from: { opacity: '0' }, to: { opacity: '1' } },
        'overlay-hide': { from: { opacity: '1' }, to: { opacity: '0' } },
        'content-show': {
          from: { opacity: '0', transform: 'scale(0.95) translateY(0.25rem)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0rem)' },
        },
        'content-hide': {
          from: { opacity: '1', transform: 'scale(1) translateY(0rem)' },
          to: { opacity: '0', transform: 'scale(0.95) translateY(0.25rem)' },
        },
      },
      animation: {
        'overlay-show': 'overlay-show 150ms ease-in-out',
        'overlay-hide': 'overlay-hide 150ms ease-in-out',
        'content-show': 'content-show 150ms ease-in-out',
        'content-hide': 'content-hide 150ms ease-in-out',
      },
    },
  },
  plugins: [
    formsPlugin(),
    typographyPlugin(),
    kobaltePlugin({ prefix: 'ui' }),
    plugin(({ addComponents }) => {
      addComponents({
        '.overflow-touch-scrolling': {
          '-webkit-overflow-scrolling': 'touch',
        },
        '.scrollbar-hide': {
          scrollbarWidth: 'none',
          '-webkit-overflow-scrolling': 'touch',
          '&::-webkit-scrollbar': {
            display: 'none',
            width: '0',
            background: 'transparent',
          },
        },
      });
    }),
  ],
} satisfies Config;
