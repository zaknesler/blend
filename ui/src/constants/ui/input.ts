import { cva } from 'class-variance-authority';

export const input = cva(
  [
    'form-input size-full appearance-none rounded-lg border bg-white font-normal shadow-xs transition-[border,box-shadow]',
    'focus:outline-none focus:ring-4 focus:ring-opacity-30',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'dark:bg-gray-900 dark:text-gray-100',
  ],
  {
    variants: {
      error: {
        true: ['border-red-500', 'focus:border-red-600 focus:ring-red-500', 'dark:border-red-900'],
        false: [
          'border-gray-200 text-gray-700',
          'focus:border-gray-600 focus:ring-gray-500',
          'dark:border-gray-800 dark:focus:border-gray-500 dark:focus:ring-gray-800',
        ],
      },
      size: {
        sm: 'px-3 py-1.5',
        md: 'px-4 py-3',
      },
      disabled: { true: 'pointer-events-none select-none opacity-50' },
      withIcon: { true: 'pl-12' },
    },
    defaultVariants: {
      error: false,
      disabled: false,
      withIcon: false,
    },
  },
);
