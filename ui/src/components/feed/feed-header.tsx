import { Match, Show, Switch } from 'solid-js';
import { View } from '~types/bindings';
import { useQueryState } from '~/contexts/query-state-context';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';
import { formatNumber } from '~/utils/format';

type FeedHeaderProps = {
  title?: string | null;
  subtitle?: string | null;
  items?: number | null;
};

export const FeedHeader = (props: FeedHeaderProps) => {
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
      <h2 class="truncate text-sm font-semibold" innerHTML={props.title || undefined} />
      <Show when={props.subtitle}>
        <small class="truncate text-xs text-gray-500 select-none dark:text-gray-400">{props.subtitle}</small>
      </Show>

      <small class="truncate text-xs text-gray-500 select-none dark:text-gray-400">
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
