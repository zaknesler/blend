import { type VariantProps, cva } from 'class-variance-authority';
import type { Component, JSX } from 'solid-js';

const spinner = cva('animate-spin', {
  variants: {
    variant: {
      dark: 'text-gray-600',
      light: 'text-white',
    },
    size: {
      xs: 'h-4 w-4',
      sm: 'h-5 w-5',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      full: 'h-full w-full',
    },
  },
  defaultVariants: {
    variant: 'dark',
    size: 'md',
  },
});

type SpinnerProps = JSX.IntrinsicElements['svg'] & VariantProps<typeof spinner>;

export const Spinner: Component<SpinnerProps> = props => (
  <svg
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    class={spinner({ class: props.class, size: props.size, variant: props.variant })}
  >
    <title>Loading spinner</title>
    <path
      d="M7.5 1.25C8.32076 1.25 9.13349 1.41166 9.89177 1.72575C10.6501 2.03984 11.3391 2.50022 11.9194 3.08058C12.4998 3.66095 12.9602 4.34994 13.2742 5.10823C13.5883 5.86651 13.75 6.67924 13.75 7.5"
      stroke="currentColor"
      stroke-width="2.5"
    />
    <path
      d="M13.75 7.5C13.75 8.73613 13.3834 9.94451 12.6967 10.9723C12.0099 12.0001 11.0338 12.8012 9.89177 13.2742C8.74973 13.7473 7.49307 13.8711 6.28069 13.6299C5.0683 13.3888 3.95466 12.7935 3.08058 11.9194C2.2065 11.0453 1.61125 9.9317 1.37009 8.71931C1.12893 7.50693 1.25271 6.25027 1.72575 5.10823C2.1988 3.96619 2.99988 2.99007 4.02769 2.30331C5.05549 1.61656 6.26387 1.25 7.5 1.25"
      stroke="currentColor"
      stroke-width="2.5"
      class="opacity-50"
    />
  </svg>
);
