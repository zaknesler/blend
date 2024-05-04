import { A, useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import dayjs from 'dayjs';
import { For, Match, Switch } from 'solid-js';
import { getEntries } from '~/api/entries';
import { getFeed } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';

export default () => {
  const params = useParams();

  const feed = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_VIEW, params.feed_uuid],
    queryFn: () => getFeed(params.feed_uuid),
  }));

  const entries = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_ENTRIES, params.feed_uuid],
    queryFn: () => getEntries(params.feed_uuid),
  }));

  return (
    <main class="flex flex-col gap-4">
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

      <Switch>
        <Match when={entries.isPending}>
          <p>Loading entries...</p>
        </Match>

        <Match when={entries.isError}>
          <p>Error: {entries.error?.message}</p>
        </Match>

        <Match when={entries.isSuccess}>
          {entries.data?.length ? (
            <div class="flex max-w-md flex-col gap-4">
              <For each={entries.data}>
                {entry => (
                  <A href={`/feeds/${entry.feed_uuid}/entries/${entry.uuid}`} class="rounded-lg border p-4">
                    <h3>{entry.title}</h3>
                    <small>{dayjs(entry.published_at).format('MMMM DD, YYYY [at] h:mm a')}</small>
                  </A>
                )}
              </For>
            </div>
          ) : (
            <div>No entries.</div>
          )}
        </Match>
      </Switch>
    </main>
  );
};
