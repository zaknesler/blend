import { Tabs as BaseTabs } from '@kobalte/core/tabs';
import { cx } from 'class-variance-authority';
import { type Component, For } from 'solid-js';

const wrapperClass = cx(
  '-mx-1 xl:-mt-1 scrollbar-hide flex select-none self-stretch overflow-auto rounded-xl font-medium text-xs backdrop-blur-sm',
  'border border-gray-950/5 bg-gray-100 text-gray-600',
  'dark:border-gray-950/60 dark:bg-gray-800 dark:text-white dark:shadow-md',
);

const triggerClass = cx(
  'group z-20 m-1 flex flex-1 cursor-default items-center justify-center rounded-lg p-2 transition',
  'inset-ring-gray-950/15',
  'hover:bg-gray-200',
  'ui-selected:inset-ring ui-selected:bg-white ui-selected:shadow-xs',
  'dark:hover:bg-gray-900',
  'dark:ui-selected:inset-ring-0 dark:ui-selected:bg-gray-700',
);

export type TabItem = {
  value: string;
  label: string;
};

type TabsProps = {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
};

export const Tabs: Component<TabsProps> = props => {
  return (
    <BaseTabs value={props.value} onChange={props.onChange} class={wrapperClass}>
      <BaseTabs.List class="-space-x-1 relative flex w-full">
        <For each={props.items}>
          {item => (
            <BaseTabs.Trigger class={triggerClass} value={item.value}>
              {item.label}
            </BaseTabs.Trigger>
          )}
        </For>
      </BaseTabs.List>
    </BaseTabs>
  );
};
