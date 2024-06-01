import { createQuery } from '@tanstack/solid-query';
import { type Component, Match, Switch, createSignal } from 'solid-js';
import { getFeed } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { MenuFeed } from '../menus/feed-menu';
import { FeedHeader } from './feed-header';

type FeedInfoProps = {
  uuid: string;
};

export const FeedInfo: Component<FeedInfoProps> = props => {
  const [contextMenuOpen, setContextMenuOpen] = createSignal(false);

  const feed = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_VIEW, props.uuid],
    queryFn: () => getFeed(props.uuid),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
        <div class="flex w-full items-start gap-4 overflow-hidden">
          <FeedHeader title={feed.data?.title_display || feed.data?.title} subtitle={feed.data?.url_feed} />

          <MenuFeed
            uuid={props.uuid}
            open={contextMenuOpen()}
            setOpen={setContextMenuOpen}
            triggerClass="h-6 w-6 rounded-md"
            gutter={4}
          />
        </div>
      </Match>
    </Switch>
  );
};
