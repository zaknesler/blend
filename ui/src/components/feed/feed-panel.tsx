import { Panel } from '~/components/layout/panel';
import { EntryList } from '~/components/entry/entry-list';
import { FeedInfo } from '~/components/feed/feed-info';
import { FeedHeader } from '~/components/feed/feed-header';
import { For, createSignal } from 'solid-js';
import { createElementBounds } from '@solid-primitives/bounds';
import { Tabs } from '@kobalte/core/tabs';
import { TABS, Tab } from '~/constants/tabs';
import { useFilterParams } from '~/hooks/use-filter-params';
import { cx } from 'class-variance-authority';

export const FeedPanel = () => {
  const filter = useFilterParams();

  const [container, setContainer] = createSignal<HTMLElement>();
  const containerBounds = createElementBounds(container);
  const viewingEntry = () => !!filter.params.entry_uuid;

  const getUnreadAsTab = (): Tab => {
    const value = filter.getUnread();
    if (value === true) return 'unread';
    return 'all';
  };

  const setUnreadFromTab = (value: Tab) => {
    filter.setUnread(value === 'unread' ? true : undefined);
  };

  return (
    <Panel
      class={cx(
        'relative shrink-0 flex-col gap-2 p-4 md:max-w-[16rem] lg:max-w-xs xl:max-w-md',
        viewingEntry() ? 'hidden md:flex' : 'flex',
      )}
      ref={setContainer}
    >
      <div class="flex justify-between">
        {filter.params.feed_uuid ? <FeedInfo uuid={filter.params.feed_uuid!} /> : <FeedHeader title="All feeds" />}
      </div>

      <Tabs
        value={getUnreadAsTab()}
        onChange={value => setUnreadFromTab(value as Tab)}
        class="sticky top-0 z-10 flex w-full self-stretch rounded-lg bg-gray-200/40 text-xs font-medium text-gray-600 backdrop-blur-sm"
      >
        <Tabs.List class="relative flex w-full -space-x-1">
          <For each={TABS}>
            {tab => (
              <Tabs.Trigger
                class="group z-20 flex flex-1 items-center justify-center rounded-lg p-1 transition focus:outline-none"
                value={tab.value}
              >
                <div
                  class={cx(
                    'w-full rounded-md border border-transparent px-2 py-1.5 transition',
                    'group-hover:bg-gray-50 group-focus:!border-gray-400 group-focus:ring-[2px] group-focus:ring-gray-200',
                    'ui-group-selected:bg-white ui-group-selected:shadow',
                  )}
                >
                  {tab.label}
                </div>
              </Tabs.Trigger>
            )}
          </For>
        </Tabs.List>
      </Tabs>

      <EntryList containerBounds={containerBounds} />
    </Panel>
  );
};
