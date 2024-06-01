import { createQuery } from '@tanstack/solid-query';
import { HiOutlineArrowPath } from 'solid-icons/hi';
import { type Component, Match, Switch, createSignal } from 'solid-js';
import { getFeed } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { useRefreshFeed } from '~/hooks/queries/use-refresh-feed';
import { FeedMenu } from '../menus/menu-feed';
import { IconButton } from '../ui/button/icon-button';
import { FeedHeader } from './feed-header';

type FeedInfoProps = {
  uuid: string;
};

export const FeedInfo: Component<FeedInfoProps> = props => {
  const refresh = useRefreshFeed();

  const feed = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_VIEW, props.uuid],
    queryFn: () => getFeed(props.uuid),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

  const [contextMenuOpen, setContextMenuOpen] = createSignal(false);

  return (
    <Switch>
      <Match when={feed.isPending}>
        <p>Loading feed...</p>
      </Match>

      <Match when={feed.isError}>
        <p>Error: {feed.error?.message}</p>
      </Match>

      <Match when={feed.isSuccess}>
        <div class="flex w-full items-start gap-2">
          <FeedHeader title={feed.data?.title_display || feed.data?.title} subtitle={feed.data?.url_feed} />

          <IconButton
            onClick={() => refresh.refreshFeed(props.uuid)}
            icon={HiOutlineArrowPath}
            tooltip="Refresh feed"
            class="size-6 rounded-md text-gray-500"
          />

          <FeedMenu
            uuid={props.uuid}
            open={contextMenuOpen()}
            setOpen={setContextMenuOpen}
            triggerClass="size-6 rounded-md"
            gutter={4}
          />
        </div>
      </Match>
    </Switch>
  );
};
