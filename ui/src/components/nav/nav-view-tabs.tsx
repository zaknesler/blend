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
  '-mx-1 xl:-mt-1 scrollbar-hide flex select-none self-stretch overflow-auto rounded-lg border border-gray-200/50 bg-gray-100 font-medium text-gray-600 text-xs backdrop-blur-sm',
  'dark:border-gray-950/50 dark:bg-gray-800 dark:text-white dark:shadow-md',
);

const triggerClass = cx(
  'group z-20 flex flex-1 cursor-default items-center justify-center rounded-lg p-1 transition',
  'focus:outline-none',
);

const triggerInnerClass = cx(
  'flex w-full items-center justify-center gap-2 rounded-md border border-transparent px-2 py-1.5 transition',
  'group-focus:!border-gray-400 group-hover:border-gray-200/50 group-hover:bg-gray-200 group-focus:ring-[2px] group-focus:ring-gray-200',
  'dark:group-focus:!border-gray-600 dark:group-hover:!border-gray-700 dark:group-focus:ring-gray-800 dark:group-hover:bg-gray-700',
  'ui-group-selected:bg-white ui-group-selected:shadow',
  'ui-group-selected:shadow ui-group-selected:dark:bg-gray-950',
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
              <div class={triggerInnerClass}>{VIEW_LABELS[view]}</div>
            </Tabs.Trigger>
          )}
        </For>
      </Tabs.List>
    </Tabs>
  );
};
