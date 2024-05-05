import { Panel } from '~/components/layout/panel';
import { EntryList } from '~/components/entry/entry-list';
import { FeedInfo } from '~/components/feed/feed-info';
import { FeedHeader } from '~/components/feed/feed-header';
import { EntryPanel } from '~/components/entry/entry-panel';
import { For, createSignal } from 'solid-js';
import { createElementBounds } from '@solid-primitives/bounds';
import { Tabs } from '@kobalte/core/tabs';
import { TABS, Tab } from '~/constants/tabs';
import { useFilterParams } from '~/hooks/use-filter-params';

export default () => {
  const filter = useFilterParams();

  const [container, setContainer] = createSignal<HTMLElement>();
  const containerBounds = createElementBounds(container);

  const getUnreadAsTab = (): Tab => {
    const value = filter.getUnread();
    if (value === true) return 'unread';
    return 'all';
  };

  const setUnreadFromTab = (value: Tab) => {
    filter.setUnread(value === 'unread' ? true : undefined);
  };

  return (
    <>
      <Panel class="flex max-w-md shrink-0 flex-col gap-2 p-4" ref={setContainer}>
        <div class="flex justify-between">
          {filter.params.feed_uuid ? <FeedInfo uuid={filter.params.feed_uuid!} /> : <FeedHeader title="All feeds" />}
        </div>

        <Tabs
          value={getUnreadAsTab()}
          onChange={value => setUnreadFromTab(value as Tab)}
          class="flex w-full self-stretch rounded-lg bg-gray-100 text-xs font-medium text-gray-600"
        >
          <Tabs.List class="relative flex w-full -space-x-1">
            <For each={TABS}>
              {tab => (
                <Tabs.Trigger
                  class="group z-20 flex flex-1 items-center justify-center rounded-lg p-1 focus:outline-none"
                  value={tab.value}
                >
                  <div class="w-full rounded-md p-2 group-hover:bg-gray-50 group-focus:outline ui-group-selected:bg-white ui-group-selected:shadow">
                    {tab.label}
                  </div>
                </Tabs.Trigger>
              )}
            </For>
          </Tabs.List>
        </Tabs>

        <EntryList containerBounds={containerBounds} />
      </Panel>

      {filter.params.entry_uuid && <EntryPanel />}
    </>
  );
};
