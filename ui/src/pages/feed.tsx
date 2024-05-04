import { A, useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import dayjs from 'dayjs';
import { For, Match, Show, Switch } from 'solid-js';
import { getEntries, getEntry } from '~/api/entries';
import { getFeed } from '~/api/feeds';
import { EntryView } from '~/components/entry';
import { Panel } from '~/components/layout/panel';
import { QUERY_KEYS } from '~/constants/query';

export default () => (
  <>
    <Panel class="flex max-w-md flex-col gap-4 p-4">
      <FeedInfo />
      <EntriesList />
    </Panel>

    <EntryPanel />
  </>
);

const FeedInfo = () => {
  const params = useParams();

  const feed = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_VIEW, params.feed_uuid],
    queryFn: () => getFeed(params.feed_uuid),
  }));

  return (
    <Switch>
      <Match when={feed.isPending}>
        <p>Loading feed...</p>
      </Match>

      <Match when={feed.isError}>
        <p>Error: {feed.error?.message}</p>
      </Match>

      <Match when={feed.isSuccess}>
        <div class="flex max-w-md flex-col">
          <h2 class="font-semibold">{feed.data?.title}</h2>
          <small class="text-xs text-gray-500">{feed.data?.url}</small>
        </div>
      </Match>
    </Switch>
  );
};

const EntriesList = () => {
  const params = useParams();

  const entries = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_ENTRIES, params.feed_uuid],
    queryFn: () => getEntries(params.feed_uuid),
  }));

  return (
    <Switch>
      <Match when={entries.isPending}>
        <p>Loading entries...</p>
      </Match>

      <Match when={entries.isError}>
        <p>Error: {entries.error?.message}</p>
      </Match>

      <Match when={entries.isSuccess}>
        {entries.data?.length ? (
          <div class="flex flex-col gap-4">
            <For each={entries.data}>
              {entry => (
                <A
                  href={`/feeds/${entry.feed_uuid}/entries/${entry.uuid}`}
                  activeClass="border-gray-500 bg-gray-100"
                  inactiveClass="bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                  class="flex flex-col gap-2 rounded-lg border p-4 focus:border-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                  <h3 class="text-base/5">{entry.title}</h3>
                  <small class="text-xs text-gray-500">{dayjs(entry.published_at).format('MMMM DD, YYYY')}</small>
                </A>
              )}
            </For>
          </div>
        ) : (
          <div>No entries.</div>
        )}
      </Match>
    </Switch>
  );
};

const EntryPanel = () => {
  const params = useParams();

  const entry = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_ENTRIES_VIEW, params.feed_uuid, params.entry_uuid],
    queryFn: () => getEntry(params.feed_uuid, params.entry_uuid),
  }));

  return (
    <Show when={params.feed_uuid && params.entry_uuid}>
      <Switch>
        <Match when={entry.isPending}>
          <Panel class="p-4 md:p-8">Loading entry...</Panel>
        </Match>

        <Match when={entry.isError}>
          <Panel class="p-4 md:p-8">Error: {entry.error?.message}</Panel>
        </Match>

        <Match when={entry.isSuccess}>
          <Panel class="p-4 md:p-8">
            {entry.data ? <EntryView entry={entry.data} class="max-w-4xl" /> : <div>No entry!</div>}
          </Panel>
        </Match>
      </Switch>
    </Show>
  );
};
