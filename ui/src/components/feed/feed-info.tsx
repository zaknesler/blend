import { createQuery } from '@tanstack/solid-query';
import { cx } from 'class-variance-authority';
import { HiOutlineArrowPath, HiOutlineEnvelope } from 'solid-icons/hi';
import { type Component, Match, Switch, createSignal } from 'solid-js';
import { getFeed } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { useNotifications } from '~/contexts/notification-context';
import { useRefreshFeed } from '~/hooks/queries/use-refresh-feed';
import { FeedMenu } from '../menus/menu-feed';
import { IconButton } from '../ui/button/icon-button';
import { FeedHeader } from './feed-header';

type FeedInfoProps = {
  uuid: string;
};

export const FeedInfo: Component<FeedInfoProps> = props => {
  const refresh = useRefreshFeed();
  const notifications = useNotifications();

  const feed = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_VIEW, props.uuid],
    queryFn: () => getFeed(props.uuid),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

  const [contextMenuOpen, setContextMenuOpen] = createSignal(false);

  const isRefreshing = () => notifications.isFeedRefreshing(props.uuid);

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
          <FeedHeader title={feed.data?.title_display || feed.data?.title} />

          <IconButton
            disabled
            icon={HiOutlineEnvelope}
            tooltip="Mark feed as read"
            class="size-8 rounded-lg text-gray-500 md:size-6 md:rounded-md"
            iconClass="size-5 md:size-4"
          />

          <IconButton
            onClick={() => refresh.refreshFeed(props.uuid)}
            icon={HiOutlineArrowPath}
            tooltip="Refresh feed"
            class="size-8 rounded-lg text-gray-500 md:size-6 md:rounded-md"
            iconClass={cx('size-5 md:size-4', isRefreshing() && 'animate-spin')}
          />

          <FeedMenu
            uuid={props.uuid}
            open={contextMenuOpen()}
            setOpen={setContextMenuOpen}
            triggerClass="size-8 md:size-6 rounded-lg lg:rounded-md"
            triggerIconClass="size-5 md:size-4"
            gutter={4}
          />
        </div>
      </Match>
    </Switch>
  );
};
