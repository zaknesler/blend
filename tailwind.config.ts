import kobaltePlugin from '@kobalte/tailwindcss';
import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';
import { screens } from './ui/src/constants/screens';

export default {
  content: ['./ui/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      screens,
      colors: {
        gray: colors.stone,
        bg: {
          light: 'rgb(238, 238, 238)',
          dark: colors.stone[950],
        },
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
        'collapse-down': {
          from: { height: '0' },
          to: { height: 'var(--kb-collapsible-content-height)' },
        },
        'collapse-up': {
          from: { height: 'var(--kb-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'overlay-show': 'overlay-show 150ms ease-in-out',
        'overlay-hide': 'overlay-hide 150ms ease-in-out',
        'content-show': 'content-show 150ms ease-in-out',
        'content-hide': 'content-hide 150ms ease-in-out',
        'collapse-up': 'collapse-up 150ms ease-in-out',
        'collapse-down': 'collapse-down 150ms ease-in-out',
      },
      boxShadow: {
        top: '0 -1px 3px 0 rgb(0 0 0 / 0.1), 0 -1px 2px -1px rgb(0 0 0 / 0.1)',
        'top-xl': '0 -20px 25px -5px rgb(0 0 0 / 0.1), 0 -8px 10px -6px rgb(0 0 0 / 0.1)',
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
