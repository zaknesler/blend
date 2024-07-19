import { cva } from 'class-variance-authority';

export const trigger = cva([
  'flex shrink-0 cursor-default touch-manipulation appearance-none items-center justify-center border border-gray-200 text-gray-500 transition dark:border-gray-700 dark:text-gray-400',
  'bg-white hover:bg-gray-100 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 group-hover:opacity-100 dark:focus:border-gray-600 dark:focus:ring-gray-700',
  'hover:border-gray-300 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-100',
  'ui-disabled:cursor-not-allowed ui-disabled:opacity-50',
]);

export const item = cva([
  'flex select-none appearance-none items-center gap-3 rounded-md px-2 py-1.5 text-left md:gap-2 md:rounded md:px-2 md:py-1',
  'ui-disabled:cursor-not-allowed ui-disabled:opacity-50',
  'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none active:bg-gray-100',
  'dark:active:bg-gray-800 dark:focus:bg-gray-800 dark:hover:bg-gray-800',
]);

export const itemIcon = cva('size-4 text-gray-400 dark:text-gray-500');

export const itemKbd = cva('ml-auto inline-flex items-baseline gap-1 font-mono text-gray-400 dark:text-gray-500');

export const content = cva(
  [
    'z-50 overflow-hidden rounded-lg border shadow-sm focus:outline-none md:rounded-md dark:shadow-md',
    'border-gray-200 bg-white text-gray-600',
    'dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200',
    'animate-content-hide ui-expanded:animate-content-show',
  ],
  {
    variants: {
      size: {
        sm: 'min-w-36 md:min-w-28',
        md: 'min-w-48 md:min-w-36',
        lg: 'min-w-64 md:min-w-48',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const contentInner = cva('flex flex-col gap-0.5 p-1.5 text-base md:p-1 md:text-sm');

export const contentSeparator = cva('-mx-1.5 md:-mx-1 my-1 h-px border-gray-200 dark:border-gray-800');
