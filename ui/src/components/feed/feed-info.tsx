import { createQuery } from '@tanstack/solid-query';
import { Switch, Match, Component, createSignal } from 'solid-js';
import { getFeed } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { FeedHeader } from './feed-header';
import { FeedContextButton } from './feed-context-button';

type FeedInfoProps = {
  uuid: string;
};

export const FeedInfo: Component<FeedInfoProps> = props => {
  const [contextMenuOpen, setContextMenuOpen] = createSignal(false);

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
        <div class="flex w-full items-start justify-between">
          <FeedHeader title={feed.data?.title} subtitle={feed.data?.url_feed} />
          <FeedContextButton
            uuid={props.uuid}
            open={contextMenuOpen()}
            setOpen={setContextMenuOpen}
            triggerClass="h-6 w-6"
            triggerIconClass="w-4 h-4 text-gray-500"
            gutter={4}
          />
        </div>
      </Match>
    </Switch>
  );
};
