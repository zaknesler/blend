import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';
import formsPlugin from '@tailwindcss/forms';
import kobaltePlugin from '@kobalte/tailwindcss';

export default {
  content: ['./ui/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        gray: colors.stone,
      },
      width: {
        sidebar: '20rem',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        overlayHide: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        contentShow: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        contentHide: {
          from: { opacity: '1', transform: 'scale(1)' },
          to: { opacity: '0', transform: 'scale(0.96)' },
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
  plugins: [formsPlugin(), kobaltePlugin({ prefix: 'ui' })],
} satisfies Config;
