import { cva } from 'class-variance-authority';

export const trigger = cva([
  'flex shrink-0 cursor-default appearance-none items-center justify-center border border-gray-200 transition dark:border-gray-700',
  'bg-white focus:border-gray-400 hover:bg-gray-100 group-hover:opacity-100 focus:outline-none dark:focus:ring-gray-600 focus:ring-1 focus:ring-gray-200',
  'dark:hover:border-gray-700 hover:border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-600',
]);

export const item = cva([
  'flex select-none appearance-none items-center gap-2 rounded px-2 py-1 text-left',
  'ui-disabled:cursor-not-allowed ui-disabled:opacity-50',
  'active:bg-gray-100 focus:bg-gray-100 hover:bg-gray-100 focus:outline-none',
  'dark:active:bg-gray-800 dark:focus:bg-gray-800 dark:hover:bg-gray-800',
]);

export const content = cva(
  [
    'z-50 overflow-hidden rounded-md border shadow-sm dark:shadow-md',
    'border-gray-200 bg-white text-gray-600',
    'dark:border-gray-900 dark:bg-gray-950 dark:text-gray-200',
    'animate-content-hide ui-expanded:animate-content-show',
  ],
  {
    variants: {
      size: {
        sm: 'min-w-28',
        md: 'min-w-36',
        lg: 'min-w-40',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const contentInner = cva(['flex flex-col gap-0.5 p-1 text-sm']);
