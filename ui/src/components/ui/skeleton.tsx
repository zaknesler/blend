import { cva, type VariantProps } from 'class-variance-authority';

const skeletonClass = cva('w-full animate-pulse rounded-lg', {
  variants: {
    variant: {
      white: 'bg-white dark:bg-gray-950',
      light: 'bg-gray-100 dark:bg-gray-950',
      dark: 'bg-gray-200 dark:bg-gray-800',
    },
  },
  defaultVariants: {
    variant: 'light',
  },
});

type SkeletonProps = VariantProps<typeof skeletonClass> & { class?: string };

export const Skeleton = (props: SkeletonProps) => (
  <div
    class={skeletonClass({
      class: props.class,
      variant: props.variant,
    })}
  />
);
