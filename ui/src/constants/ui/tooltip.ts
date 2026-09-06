import { cva } from 'class-variance-authority';

export const content = cva(
  [
    'z-50 select-none bg-gray-800 text-gray-100 dark:bg-gray-700',
    'animate-content-hide ui-expanded:animate-content-show',
  ],
  {
    variants: {
      size: {
        sm: 'rounded-md px-2 py-1 text-xs',
        md: 'rounded-lg px-3 py-2 text-xs',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);
