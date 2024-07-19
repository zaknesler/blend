import { cva, cx } from 'class-variance-authority';

const base = cx(
  'flex touch-manipulation select-none items-center gap-2 rounded-lg border p-1 text-base no-underline transition focus:outline-none md:rounded-md md:text-sm',
  'text-gray-600 focus:border-gray-400 dark:text-gray-300 dark:focus:border-gray-600',
);

const inactiveClass = cx(
  'border-transparent',
  'hover:bg-gray-100 hover:text-gray-900 xl:hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-white',
  'focus:text-gray-700 dark:focus:text-white',
);

export const item = cva(base, {
  variants: {
    active: {
      true: 'border-gray-200 bg-gray-100 text-gray-900 xl:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white',
      false: inactiveClass,
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const folderTrigger = cva(
  'touch-manipulation rounded-md border border-transparent transition hover:bg-gray-200 focus:border-gray-400 focus:outline-none md:rounded dark:focus:border-gray-600 dark:hover:bg-gray-700',
  {
    variants: {
      active: {
        false: 'xl:hover:bg-gray-300',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
