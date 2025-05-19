import { Tabs } from '@kobalte/core/tabs';
import { useNavigate } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { For } from 'solid-js';
import { DEFAULTS } from '~/constants/query';
import { VIEWS, VIEW_LABELS } from '~/constants/views';
import { useQueryState } from '~/contexts/query-state-context';
import type { View } from '~/types/bindings';
import { formatQueryString } from '~/utils/query';

const wrapperClass = cx(
  '-mx-1 xl:-mt-1 scrollbar-hide flex select-none self-stretch overflow-auto rounded-lg border border-gray-200 bg-gray-100 font-medium text-gray-600 text-xs backdrop-blur-sm',
  'dark:border-gray-950/50 dark:bg-gray-800 dark:text-white dark:shadow-md',
);

const triggerClass = cx(
  'group z-20 m-1 flex flex-1 cursor-default items-center justify-center rounded-lg p-2 transition',
  'inset-ring-gray-300 outline-black outline-offset-1 hover:bg-gray-200 focus-visible:outline-2',
  'ui-selected:inset-ring ui-selected:bg-white',
);

export const NavViewTabs = () => {
  const state = useQueryState();
  const navigate = useNavigate();

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

  return (
    <Tabs value={state.getView()} onChange={value => handleSetView(value as View)} class={wrapperClass}>
      <Tabs.List class="-space-x-1 relative flex w-full">
        <For each={VIEWS}>
          {view => (
            <Tabs.Trigger class={triggerClass} value={view}>
              {VIEW_LABELS[view]}
            </Tabs.Trigger>
          )}
        </For>
      </Tabs.List>
    </Tabs>
  );
};
