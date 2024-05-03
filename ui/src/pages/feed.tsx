import { A, useParams } from '@solidjs/router';
import { For, Match, Switch } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';
import { getFeed } from '~/api/feeds';
import dayjs from 'dayjs';

export default () => {
  const params = useParams();
  const feed = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEED, params.uuid],
    queryFn: () => getFeed(params.uuid),
  }));

  return (
    <main class="flex flex-col gap-4 font-serif">
      <Switch>
        <Match when={feed.isPending}>
          <p>Loading...</p>
        </Match>

        <Match when={feed.isError}>
          <p>Error: {feed.error?.message}</p>
        </Match>

        <Match when={feed.isSuccess}>
          <div class="flex max-w-md flex-col gap-4">
            <For each={feed.data?.entries}>
              {entry => (
                <A href={`/feeds/${entry.feed_uuid}/entries/${entry.uuid}`} class="rounded-lg border p-4">
                  <h3>{entry.title}</h3>
                  <small>{dayjs(entry.published_at).format('MMMM DD, YYYY [at] h:mm a')}</small>
                </A>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </main>
  );
};
