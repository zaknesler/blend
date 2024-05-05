import defaultTheme from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';
import formsPlugin from '@tailwindcss/forms';
import kobaltePlugin from '@kobalte/tailwindcss';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./ui/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
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
        overlayShow: { from: { opacity: '0' }, to: { opacity: '1' } },
        overlayHide: { from: { opacity: '1' }, to: { opacity: '0' } },
        contentShow: {
          from: { opacity: '0', transform: 'scale(0.95) translateY(0.25rem)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0rem)' },
        },
        contentHide: {
          from: { opacity: '1', transform: 'scale(1) translateY(0rem)' },
          to: { opacity: '0', transform: 'scale(0.95) translateY(0.25rem)' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms ease-in-out',
        overlayHide: 'overlayHide 150ms ease-in-out',
        contentShow: 'contentShow 150ms ease-in-out',
        contentHide: 'contentHide 150ms ease-in-out',
      },
    },
  },
  plugins: [
    formsPlugin(),
    typographyPlugin(),
    kobaltePlugin({ prefix: 'ui' }),
    plugin(({ addComponents }) => {
      addComponents({
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
