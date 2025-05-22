import { type Component, Match, Show, Switch } from 'solid-js';
import { useQueryState } from '~/contexts/query-state-context';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';
import { View } from '~/types/bindings';
import { formatNumber } from '~/utils/format';

type FeedHeaderProps = {
  title?: string | null;
  subtitle?: string | null;
  items?: number | null;
};

export const FeedHeader: Component<FeedHeaderProps> = props => {
  const state = useQueryState();
  const stats = useFeedsStats();

  const getViewText = () => {
    switch (state.getView()) {
      case View.Unread:
        return 'unread';

      case View.Saved:
        return 'saved';

      default:
        return null;
    }
  };

  return (
    <div class="flex flex-1 shrink flex-col overflow-hidden whitespace-nowrap">
      <h2 class="truncate font-semibold text-sm" innerHTML={props.title || undefined} />
      <Show when={props.subtitle}>
        <small class="select-none truncate text-gray-500 text-xs dark:text-gray-400">{props.subtitle}</small>
      </Show>

      <small class="select-none truncate text-gray-500 text-xs dark:text-gray-400">
        <Switch>
          <Match when={stats.byView() === null}>Loading...</Match>
          <Match when={!stats.byView()}>No {getViewText()} items</Match>
          <Match when={stats.byView()}>
            {formatNumber(stats.byView()!)} {getViewText()} {stats.byView() === 1 ? 'item' : 'items'}
          </Match>
        </Switch>
      </small>
    </div>
  );
};
