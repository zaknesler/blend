import { cva } from 'class-variance-authority';

export const button = cva(
  [
    'pointer-default inline-flex touch-manipulation select-none appearance-none items-center justify-center gap-1.5 overflow-hidden font-semibold shadow-neutral-300 transition',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-opacity-30',
    'inset-shadow-white/15 inset-shadow-xs rounded-lg px-3 py-1.5 text-xs shadow-xs dark:shadow-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-br from-gray-500 to-gray-600 text-white',
          'hover:from-gray-600 hover:to-gray-700',
          'active:from-gray-700 active:to-gray-800',
          'focus-visible:ring-gray-300',
          'dark:from-gray-700 dark:to-gray-800 dark:focus-visible:ring-gray-500',
          'dark:active:from-gray-500 dark:active:to-gray-600',
        ],
        secondary: [
          'border border-transparent bg-white text-black ring-1 ring-gray-200 focus-visible:ring-gray-500',
          'hover:border-gray-100 hover:bg-gray-100',
          'focus-visible:border-gray-500',
          'dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-800 dark:focus-visible:border-gray-600 dark:hover:border-gray-800 dark:hover:bg-gray-800',
        ],
        danger: [
          'bg-gradient-to-br from-red-500 to-red-600 text-white',
          'hover:from-red-600 hover:to-red-700',
          'focus-visible:ring-red-500',
        ],
      },
      size: {
        xs: 'rounded-md px-3 py-1.5 text-xs shadow-sm',
        sm: 'rounded-lg px-3.5 py-1.5 text-sm shadow-sm',
        md: 'rounded-lg px-5 py-2.5 text-base shadow-md',
        lg: 'rounded-lg px-6 py-4 text-lg shadow-lg',
      },
      disabled: {
        true: 'pointer-events-auto cursor-not-allowed opacity-60',
      },
      fullWidth: {
        true: 'flex w-full',
        false: 'inline-flex',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      disabled: false,
      fullWidth: false,
    },
  },
);

export const action = cva(
  [
    'cursor-default touch-manipulation appearance-none rounded-lg text-gray-600',
    'hover:bg-gray-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-opacity-30',
    'dark:text-gray-400 dark:focus-visible:ring-gray-600 dark:hover:bg-gray-700',
    'disabled:pointer-events-none disabled:opacity-25',
  ],
  {
    variants: {
      size: {
        md: 'p-1',
        lg: 'p-2',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);
