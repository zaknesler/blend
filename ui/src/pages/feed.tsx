import { useParams } from '@solidjs/router';
import { Match, Switch } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';
import { getFeed } from '~/api/feeds';

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
          <pre>{JSON.stringify(feed.data, null, 2)}</pre>
        </Match>
      </Switch>
    </main>
  );
};
