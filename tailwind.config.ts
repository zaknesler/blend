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
        sidebar: '20rem',
      },
    },
  },
  plugins: [formsPlugin()],
} satisfies Config;
