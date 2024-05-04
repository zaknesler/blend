import { createQuery } from '@tanstack/solid-query';
import { Switch, Match, Component } from 'solid-js';
import { getFeed } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { FeedHeader } from './feed-header';

type FeedInfoProps = {
  uuid: string;
};

export const FeedInfo: Component<FeedInfoProps> = props => {
  const feed = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_VIEW, props.uuid],
    queryFn: () => getFeed(props.uuid),
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
        <FeedHeader title={feed.data?.title} subtitle={feed.data?.url_feed} />
      </Match>
    </Switch>
  );
};
