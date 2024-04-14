import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';
import formsPlugin from '@tailwindcss/forms';

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
        gutter: '4rem',
        sidebar: '16rem',
      },
    },
  },
  plugins: [formsPlugin()],
} satisfies Config;
