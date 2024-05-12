import { For } from 'solid-js';
import { Tabs } from '@kobalte/core/tabs';
import { VIEWS, VIEW_LABELS } from '~/constants/views';
import { cx } from 'class-variance-authority';
import { useFilterParams } from '~/hooks/use-filter-params';
import { View } from '~/types/bindings';

export const NavViewSwitcher = () => {
  const filter = useFilterParams();

  return (
    <Tabs
      value={filter.getView()}
      onChange={value => filter.setView(value as View)}
      class="flex w-full self-stretch rounded-lg bg-gray-200/40 text-xs font-medium text-gray-600 backdrop-blur-sm dark:bg-gray-400/25 dark:text-white"
    >
      <Tabs.List class="relative flex w-full -space-x-1">
        <For each={VIEWS}>
          {view => (
            <Tabs.Trigger
              class="group z-20 flex flex-1 items-center justify-center rounded-lg p-1 transition focus:outline-none"
              value={view}
            >
              <div
                class={cx(
                  'w-full rounded-md border border-transparent px-2 py-1.5 transition',
                  'group-hover:bg-gray-50 group-focus:!border-gray-400 group-focus:ring-[2px] group-focus:ring-gray-200',
                  'dark:group-hover:bg-gray-800 dark:group-focus:!border-gray-600 dark:group-focus:ring-gray-800',
                  'ui-group-selected:bg-white ui-group-selected:shadow',
                  'ui-group-selected:shadow ui-group-selected:dark:bg-gray-900',
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
