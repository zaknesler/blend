import { cva, type VariantProps } from 'class-variance-authority';
import { JSX, ParentComponent } from 'solid-js';
import { Button as BaseButton } from '@kobalte/core';

const button = cva(
  [
    'select-none appearance-none inline-flex items-center justify-center font-semibold shadow-gray-200 transition-colors overflow-hidden gap-1.5 shrink-0',
    'focus:outline-none focus:ring-4 focus:ring-opacity-30',
    'dark:shadow-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-br from-gray-500 to-gray-600 text-white',
          'hover:from-gray-600 hover:to-gray-700',
          'focus:ring-gray-500',
          'dark:focus:ring-gray-600 dark:from-gray-700 dark:to-gray-800',
        ],
        secondary: [
          'bg-white text-black focus:ring-gray-500 ring-1 ring-gray-200 border border-transparent',
          'hover:bg-gray-100 hover:border-gray-100',
          'focus:border-gray-500',
          'dark:bg-gray-900 dark:ring-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-800 dark:focus:border-gray-600 dark:text-gray-100',
        ],
        danger: [
          'bg-gradient-to-br from-red-500 to-red-600 text-white',
          'hover:from-red-600 hover:to-red-700',
          'focus:ring-red-500',
        ],
      },
      size: {
        xs: 'px-3 py-1.5 text-xs shadow-sm rounded-md',
        sm: 'px-3.5 py-1.5 text-sm shadow-sm rounded-lg',
        md: 'px-5 py-2.5 text-base shadow-md rounded-lg',
        lg: 'px-6 py-4 text-lg shadow-lg rounded-lg',
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

type ButtonProps = JSX.IntrinsicElements['button'] &
  VariantProps<typeof button> & {
    icon?: JSX.Element;
    iconSide?: 'left' | 'right';
    href?: string;
  };

export const Button: ParentComponent<ButtonProps> = ({
  size = 'md',
  variant = 'primary',
  iconSide = 'left',
  fullWidth = false,
  icon,
  disabled,
  class: className,
  children,
  ...props
}) => (
  <BaseButton.Root
    {...props}
    disabled={disabled}
    class={button({ size, fullWidth, variant, disabled, class: className })}
  >
    {icon ? (
      <>
        {iconSide === 'left' && icon}
        <span>{children}</span>
        {iconSide === 'right' && icon}
      </>
    ) : (
      children
    )}
  </BaseButton.Root>
);
