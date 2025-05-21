import { cva } from 'class-variance-authority';

export const button = cva(
  [
    'pointer-default inline-flex touch-manipulation select-none appearance-none items-center justify-center gap-1.5 overflow-hidden border-0 font-semibold shadow-neutral-300 transition',
    'inset-shadow-white/25 inset-shadow-xs rounded-lg px-3 py-1.5 shadow-xs',
    'dark:inset-shadow-white/15 dark:shadow-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-br from-gray-500 to-gray-600 text-shadow-2xs text-white',
          'hover:from-gray-600 hover:to-gray-700',
          'active:from-gray-700 active:to-gray-800',
        ],
        secondary: [
          'inset-ring-1 inset-ring-gray-950/20 bg-gradient-to-br from-white to-gray-50 text-black',
          'hover:inset-ring-gray-950/40 hover:from-gray-50 hover:to-gray-100',
          'active:inset-ring-gray-950/60 active:from-gray-100 active:to-gray-300',
          'dark:inset-ring-gray-800 dark:from-gray-800 dark:to-gray-900 dark:text-shadow-2xs dark:text-white',
          'dark:hover:from-gray-700 dark:hover:to-gray-800',
          'dark:hover:inset-ring-gray-700',
          'dark:active:inset-ring-gray-600 dark:active:from-gray-600 dark:active:to-gray-700',
        ],
        danger: [
          'bg-gradient-to-br from-red-500 to-red-600 text-shadow-2xs text-white',
          'hover:from-red-600 hover:to-red-700',
          'active:from-red-700 active:to-red-800',
          'dark:from-red-600 dark:to-red-700',
          'dark:hover:from-red-700 dark:hover:to-red-800',
          'dark:active:from-red-800 dark:active:to-red-900',
        ],
      },
      size: {
        sm: 'rounded-lg px-3 py-1.5 text-xs shadow-sm',
        md: 'rounded-lg px-4 py-2 text-xs shadow-md',
        lg: 'rounded-xl px-6 py-3 text-sm shadow-lg',
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
