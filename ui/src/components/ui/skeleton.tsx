import { type VariantProps, cva } from 'class-variance-authority';
import type { Component } from 'solid-js';

const skeletonClass = cva('w-full animate-pulse rounded-lg', {
  variants: {
    color: {
      light: 'bg-white dark:bg-gray-950',
      muted: 'bg-gray-100 dark:bg-gray-800',
    },
  },
  defaultVariants: {
    color: 'muted',
  },
});

type SkeletonProps = VariantProps<typeof skeletonClass> & { class?: string };

export const Skeleton: Component<SkeletonProps> = props => (
  <div
    class={skeletonClass({
      class: props.class,
      color: props.color,
    })}
  />
);
