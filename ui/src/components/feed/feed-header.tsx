import { Component } from 'solid-js';

type FeedHeaderProps = {
  title?: string | null;
  subtitle?: string | null;
};

export const FeedHeader: Component<FeedHeaderProps> = props => (
  <div class="flex max-w-md flex-col">
    <h2 class="font-semibold">{props.title}</h2>
    {props.subtitle && <small class="text-xs text-gray-500 dark:text-gray-400">{props.subtitle}</small>}
  </div>
);
