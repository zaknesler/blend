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

  const getUnreadAsTab: () => Tab = () => {
    const value = filter.getUnread();
    if (value === true) return 'unread';
    return 'all';
  };

  return (
    <>
      <Panel class="flex max-w-md shrink-0 flex-col gap-2 p-4" ref={setContainer}>
        <div class="flex justify-between">
          {filter.params.feed_uuid ? <FeedInfo uuid={filter.params.feed_uuid!} /> : <FeedHeader title="All feeds" />}
        </div>

        <Tabs
          value={getUnreadAsTab()}
          onChange={value => filter.setUnread(value as Tab)}
          class="flex w-full self-stretch rounded-lg bg-gray-100 text-xs font-medium text-gray-600"
        >
          <Tabs.List class="relative flex w-full gap-1">
            <For each={TABS}>
              {tab => (
                <Tabs.Trigger
                  class="z-20 flex flex-1 items-center justify-center rounded-lg px-2 py-2"
                  value={tab.value}
                >
                  {tab.label}
                </Tabs.Trigger>
              )}
            </For>
            <Tabs.Indicator class="absolute z-10 h-full p-1 transition">
              <div class="h-full w-full rounded-md bg-white shadow" />
            </Tabs.Indicator>
          </Tabs.List>
        </Tabs>

        <EntryList containerBounds={containerBounds} />
      </Panel>

      {filter.params.entry_uuid && <EntryPanel />}
    </>
  );
};
