import { type Component, Show } from 'solid-js';

type FeedHeaderProps = {
  title?: string | null;
  subtitle?: string | null;
};

export const FeedHeader: Component<FeedHeaderProps> = props => (
  <div class="flex flex-1 flex-col overflow-hidden whitespace-nowrap">
    <h2 class="font-semibold">{props.title}</h2>
    <Show when={props.subtitle}>
      <small class="overflow-hidden overflow-ellipsis text-gray-500 text-xs dark:text-gray-400">{props.subtitle}</small>
    </Show>
  </div>
);
