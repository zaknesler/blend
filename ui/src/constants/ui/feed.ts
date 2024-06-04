import { cva, cx } from 'class-variance-authority';

const base = cx(
  'flex select-none items-center gap-2 rounded-lg border p-1 text-base no-underline transition md:rounded-md md:text-sm focus:outline-none',
  'text-gray-600 dark:focus:border-gray-600 focus:border-gray-400 dark:text-gray-300',
);

const inactiveClass = cx(
  'border-transparent',
  'dark:hover:bg-gray-800 hover:bg-gray-100 xl:hover:bg-gray-200 dark:hover:text-white hover:text-gray-900',
  'dark:focus:text-white focus:text-gray-700',
);

export const item = cva(
  [
    base,
    '-mx-1 flex flex-1 select-none items-center gap-2 rounded-lg border p-1 text-base no-underline outline-none transition',
  ],
  {
    variants: {
      active: {
        true: 'border-gray-200 bg-gray-100 text-gray-900 dark:border-gray-700 dark:bg-gray-800 xl:bg-white dark:text-white',
        false: inactiveClass,
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const folder = cva([base, inactiveClass], {
  variants: {
    active: {
      true: '',
      false: inactiveClass,
    },
  },
  defaultVariants: {
    active: false,
  },
});
