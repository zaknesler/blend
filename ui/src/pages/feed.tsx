import { useParams } from '@solidjs/router';
import { Panel } from '~/components/layout/panel';
import { EntryList } from '~/components/entry/entry-list';
import { FeedInfo } from '~/components/feed/feed-info';
import { FeedHeader } from '~/components/feed/feed-header';
import { EntryPanel } from '~/components/entry/entry-panel';
import { For, createSignal } from 'solid-js';
import { createElementBounds } from '@solid-primitives/bounds';
import { Tabs } from '@kobalte/core/tabs';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Read', value: 'read' },
] as const;

type Tab = (typeof TABS)[number]['value'];

export default () => {
  const [selectedTab, setSelectedTab] = createSignal<Tab>('all');
  const [container, setContainer] = createSignal<HTMLElement>();

  const params = useParams<{ feed_uuid?: string; entry_uuid?: string }>();

  const containerBounds = createElementBounds(container);

  const getUnreadParam = () => {
    switch (selectedTab()) {
      case 'all':
        return undefined;
      case 'unread':
        return true;
      case 'read':
        return false;
    }
  };

  return (
    <>
      <Panel class="flex max-w-md shrink-0 flex-col gap-2 p-4 pb-2" ref={setContainer}>
        <div class="flex justify-between">
          {params.feed_uuid ? <FeedInfo uuid={params.feed_uuid} /> : <FeedHeader title="All feeds" />}
        </div>

        <Tabs
          value={selectedTab()}
          onChange={setSelectedTab}
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

        <EntryList
          containerBounds={containerBounds}
          feed_uuid={params.feed_uuid}
          current_entry_uuid={params.entry_uuid}
          unread={getUnreadParam()}
        />
      </Panel>

      {params.entry_uuid && <EntryPanel feed_uuid={params.feed_uuid} entry_uuid={params.entry_uuid} />}
    </>
  );
};
