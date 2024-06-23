import { Tabs } from '@kobalte/core/tabs';
import { useNavigate } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { For } from 'solid-js';
import { VIEWS, VIEW_LABELS } from '~/constants/views';
import { DEFAULTS, useQueryState } from '~/contexts/query-state-context';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';
import { View } from '~/types/bindings';
import { formatQueryString } from '~/utils/query';
import { sumStats } from '~/utils/stats';

const wrapperClass = cx(
  'scrollbar-hide flex w-full select-none self-stretch overflow-auto rounded-lg border border-gray-200/25 bg-gray-100 font-medium text-gray-600 text-xs backdrop-blur-sm',
  'dark:border-gray-950/50 dark:bg-gray-800 dark:text-white dark:shadow-md',
);

const triggerClass = cx(
  'group z-20 flex flex-1 cursor-default items-center justify-center rounded-lg p-1 transition',
  'focus:outline-none',
);

const triggerInnerClass = cx(
  'flex w-full items-center justify-center gap-2 rounded-md border border-transparent px-2 py-1.5 transition',
  'group-focus:!border-gray-400 group-hover:border-gray-200/50 group-hover:bg-gray-200 group-focus:ring-[2px] group-focus:ring-gray-200',
  'dark:group-focus:!border-gray-600 dark:group-hover:!border-gray-700 dark:group-hover:bg-gray-700 dark:group-focus:ring-gray-800',
  'ui-group-selected:bg-white ui-group-selected:shadow',
  'ui-group-selected:dark:bg-gray-900 ui-group-selected:shadow',
);

export const NavViewTabs = () => {
  const state = useQueryState();
  const navigate = useNavigate();

  const stats = useFeedsStats();

  const handleSetView = (view: View) => {
    if (state.getView() === view) return;

    const path = state.getFeedUrl(undefined, false).concat(
      formatQueryString({
        ...state.query,
        view: view === DEFAULTS.view ? undefined : view,
      }),
    );

    navigate(path);
  };

  const getStats = (view: View) => {
    if (!stats.query?.data) return null;

    const items = state.params.feed_uuid ? [stats.byFeed(state.params.feed_uuid)] : stats.query.data;
    const sum = sumStats(items.filter(Boolean));

    switch (view) {
      case View.Unread:
        return sum.count_unread;
      case View.Saved:
        return sum.count_saved;
      case View.All:
        return sum.count_total;
    }

    return null;
  };

  return (
    <Tabs value={state.getView()} onChange={value => handleSetView(value as View)} class={wrapperClass}>
      <Tabs.List class="-space-x-1 relative flex w-full">
        <For each={VIEWS}>
          {view => (
            <Tabs.Trigger class={triggerClass} value={view}>
              <div class={triggerInnerClass}>
                {VIEW_LABELS[view]}
                <span class="-my-0.5 rounded-md bg-white px-1.5 py-0.5 text-gray-400 dark:bg-gray-900 dark:text-gray-500">
                  {getStats(view)}
                </span>
              </div>
            </Tabs.Trigger>
          )}
        </For>
      </Tabs.List>
    </Tabs>
  );
};
