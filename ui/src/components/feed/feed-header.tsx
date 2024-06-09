import { type Component, Show } from 'solid-js';

type FeedHeaderProps = {
  title?: string;
  subtitle?: string;
};

export const FeedHeader: Component<FeedHeaderProps> = props => (
  <div class="flex flex-1 flex-shrink flex-col overflow-hidden whitespace-nowrap">
    <h2 class="truncate font-semibold" innerHTML={props.title} />
    <Show when={props.subtitle}>
      <small class="truncate text-gray-500 text-xs dark:text-gray-400">{props.subtitle}</small>
    </Show>
  </div>
);
