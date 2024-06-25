import { type Component, Show } from 'solid-js';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';

type FeedHeaderProps = {
  title?: string | null;
  subtitle?: string | null;
  items?: number | null;
};

export const FeedHeader: Component<FeedHeaderProps> = props => {
  const stats = useFeedsStats();

  return (
    <div class="flex flex-1 flex-shrink flex-col overflow-hidden whitespace-nowrap">
      <h2 class="truncate font-semibold" innerHTML={props.title || undefined} />
      <Show when={props.subtitle}>
        <small class="select-none truncate text-gray-500 text-xs dark:text-gray-400">{props.subtitle}</small>
      </Show>

      <small class="select-none truncate text-gray-500 text-xs dark:text-gray-400">
        {stats.byView()} {stats.byView() === 1 ? 'item' : 'items'}
      </small>
    </div>
  );
};
