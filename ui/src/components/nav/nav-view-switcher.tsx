import { Tabs } from '@kobalte/core/tabs';
import { cx } from 'class-variance-authority';
import { For } from 'solid-js';
import { VIEWS, VIEW_LABELS } from '~/constants/views';
import { useQueryState } from '~/hooks/use-query-state';
import type { View } from '~/types/bindings';

export const NavViewSwitcher = () => {
  const state = useQueryState();

  return (
    <Tabs
      value={state.getView()}
      onChange={value => state.setView(value as View)}
      class="flex w-full self-stretch rounded-lg bg-gray-200/40 font-medium text-gray-600 text-xs backdrop-blur-sm dark:bg-gray-400/25 dark:text-white"
    >
      <Tabs.List class="-space-x-1 relative flex w-full">
        <For each={VIEWS}>
          {view => (
            <Tabs.Trigger
              class="group z-20 flex flex-1 items-center justify-center rounded-lg p-1 transition focus:outline-none"
              value={view}
            >
              <div
                class={cx(
                  'w-full rounded-md border border-transparent px-2 py-1.5 transition',
                  'group-focus:!border-gray-400 group-hover:bg-gray-50 group-focus:ring-[2px] group-focus:ring-gray-200',
                  'dark:group-focus:!border-gray-600 dark:group-hover:bg-gray-800 dark:group-focus:ring-gray-800',
                  'ui-group-selected:bg-white ui-group-selected:shadow',
                  'ui-group-selected:dark:bg-gray-900 ui-group-selected:shadow',
                )}
              >
                {VIEW_LABELS[view]}
              </div>
            </Tabs.Trigger>
          )}
        </For>
      </Tabs.List>
    </Tabs>
  );
};
