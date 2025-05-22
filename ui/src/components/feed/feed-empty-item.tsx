import { cx } from 'class-variance-authority';
import type { Component } from 'solid-js';

type FeedEmptyItemProps = {
  class?: string;
};

export const FeedEmptyItem: Component<FeedEmptyItemProps> = props => {
  return (
    <div
      class={cx(
        'select-none rounded-md border border-gray-400 border-dashed px-2 py-1.5 text-center text-gray-700 text-xs',
        'dark:border-gray-600 dark:text-gray-400',
        props.class,
      )}
    >
      No feeds
    </div>
  );
};
