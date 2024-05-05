import { For, Match, Switch } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { getFeeds } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { Skeleton } from '../ui/skeleton';
import { FeedItem } from './feed-item';

export const FeedList = () => {
  const feeds = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS],
    queryFn: getFeeds,
  }));

  return (
    <Switch>
      <Match when={feeds.isPending}>
        <Skeleton class="h-8" color="light" />
        <Skeleton class="h-8" color="light" />
        <Skeleton class="h-8" color="light" />
        <Skeleton class="h-8" color="light" />
        <Skeleton class="h-8" color="light" />
      </Match>

      <Match when={feeds.isError}>
        <p>Error: {feeds.error?.message}</p>
      </Match>

      <Match when={feeds.isSuccess}>
        {feeds.data?.length ? <For each={feeds.data}>{feed => <FeedItem feed={feed} />}</For> : <div>No feeds.</div>}
      </Match>
    </Switch>
  );
};
