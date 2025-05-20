import { cva } from 'class-variance-authority';

export const button = cva(
  [
    'pointer-default inline-flex touch-manipulation select-none appearance-none items-center justify-center gap-1.5 overflow-hidden border-0 font-semibold shadow-neutral-300 transition',
    'outline-black focus-visible:outline-2 focus-visible:outline-offset-2',
    'dark:outline-white',
    'inset-shadow-white/25 inset-shadow-xs rounded-lg px-3 py-1.5 text-xs shadow-xs dark:shadow-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-br from-gray-500 to-gray-600 text-shadow-2xs text-white',
          'hover:from-gray-600 hover:to-gray-700',
          'active:from-gray-700 active:to-gray-800',
          'dark:from-gray-700 dark:to-gray-800',
          'dark:active:from-gray-500 dark:active:to-gray-600',
        ],
        secondary: [
          'bg-gradient-to-br from-white to-gray-50 text-black',
          'inset-ring-1 inset-ring-gray-950/20',
          'hover:inset-ring-gray-950/40 hover:from-gray-50 hover:to-gray-100',
          'active:inset-ring-gray-950/60 active:from-gray-100 active:to-gray-300',
        ],
        danger: [
          'bg-gradient-to-br from-red-500 to-red-600 text-shadow-2xs text-white',
          'hover:from-red-600 hover:to-red-700',
          'active:from-red-700 active:to-red-800',
        ],
      },
      size: {
        sm: 'rounded-lg px-3 py-1.5 text-xs shadow-sm',
        md: 'rounded-lg px-4 py-2 text-base shadow-md',
        lg: 'rounded-lg px-6 py-3 text-lg shadow-lg',
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
