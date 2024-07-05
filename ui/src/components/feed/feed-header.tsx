import { type Component, Match, Show, Switch } from 'solid-js';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';
import { formatNumber } from '~/utils/format';

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
        <Switch>
          <Match when={stats.byView() === null}>Loading...</Match>
          <Match when={!stats.byView()}>No items</Match>
          <Match when={stats.byView()}>
            {formatNumber(stats.byView()!)} {stats.byView() === 1 ? 'item' : 'items'}
          </Match>
        </Switch>
      </small>
    </div>
  );
};
