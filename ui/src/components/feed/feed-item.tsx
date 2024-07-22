import type { ContextMenuTriggerProps } from '@kobalte/core/context-menu';
import { Image } from '@kobalte/core/image';
import { A, type AnchorProps, useLocation } from '@solidjs/router';
import {
  HiOutlineArrowPath,
  HiOutlineEnvelope,
  HiOutlineFolder,
  HiOutlinePencilSquare,
  HiOutlineRss,
  HiOutlineSquare3Stack3d,
  HiOutlineTrash,
} from 'solid-icons/hi';
import { type Component, type JSX, Match, Show, Switch, createMemo, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Transition } from 'solid-transition-group';
import * as feedClasses from '~/constants/ui/feed';
import { useNotifications } from '~/contexts/notification-context';
import { useQueryState } from '~/contexts/query-state-context';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';
import { useRefreshFeed } from '~/hooks/queries/use-refresh-feed';
import { useRefreshFeeds } from '~/hooks/queries/use-refresh-feeds';
import type { Feed } from '~/types/bindings';
import { ContextMenu } from '../menus/context-menu';
import { Spinner } from '../ui/spinner';

type FeedItemProps = {
  feed: Feed;
};

export const FeedItem: Component<FeedItemProps> = props => {
  const state = useQueryState();
  const location = useLocation();

  const stats = useFeedsStats();
  const refreshFeed = useRefreshFeed();
  const notifications = useNotifications();

  const getPath = createMemo(() => `/feeds/${props.feed.uuid}`);
  const isActive = createMemo(() => location.pathname.startsWith(getPath()));
  const getStats = createMemo(() => stats.query.data?.find(item => item.uuid === props.feed.uuid));

  const getFaviconSrc = () => props.feed.favicon_b64 || props.feed.favicon_url;

  const isRefreshing = () => notifications.isFeedRefreshing(props.feed.uuid);

  return (
    <ContextMenu
      size="md"
      trigger={() => (
        <ContextMenu.Trigger
          as={(polyProps: ContextMenuTriggerProps<'a'>) => (
            <BaseFeedItem
              {...polyProps}
              href={getPath().concat(state.getQueryString())}
              title={props.feed.title_display || props.feed.title}
              active={isActive()}
              loading={isRefreshing()}
              unread_count={getStats()?.count_unread}
              favicon_src={getFaviconSrc()}
            />
          )}
        />
      )}
    >
      <ContextMenu.Item
        label="Refresh feed"
        onClick={() => refreshFeed(props.feed.uuid)}
        icon={HiOutlineArrowPath}
        iconClass={isRefreshing() && 'animate-spin'}
        disabled={isRefreshing()}
      />
      <ContextMenu.Item label="Mark feed as read" disabled icon={HiOutlineEnvelope} />
      <ContextMenu.Separator />
      <ContextMenu.Item label="Move" disabled icon={HiOutlineFolder} />
      <ContextMenu.Item label="Rename" disabled icon={HiOutlinePencilSquare} />
      <ContextMenu.Item label="Delete" disabled icon={HiOutlineTrash} />
    </ContextMenu>
  );
};

export const AllFeedsItem = () => {
  const state = useQueryState();
  const notifications = useNotifications();

  const stats = useFeedsStats();
  const refreshFeeds = useRefreshFeeds();

  return (
    <ContextMenu
      trigger={() => (
        <ContextMenu.Trigger
          as={(polyProps: ContextMenuTriggerProps<'a'>) => (
            <BaseFeedItem
              {...polyProps}
              href={'/'.concat(state.getQueryString())}
              title="All feeds"
              icon={() => <HiOutlineSquare3Stack3d class="size-6 text-gray-600 md:size-5 dark:text-gray-500" />}
              active={!state.params.feed_uuid && !state.params.folder_slug}
              unread_count={stats.total()?.count_unread}
            />
          )}
        />
      )}
    >
      <ContextMenu.Item
        label="Refresh all feeds"
        onClick={() => refreshFeeds()}
        icon={HiOutlineArrowPath}
        iconClass={!!notifications.feedsRefreshing().length && 'animate-spin'}
        disabled={!!notifications.feedsRefreshing().length}
      />
      <ContextMenu.Item label="Mark all as read" disabled icon={HiOutlineEnvelope} />
    </ContextMenu>
  );
};

type BaseFeedItemProps = Omit<AnchorProps, 'href' | 'title'> & {
  href: string;
  active: boolean;
  title?: string;
  loading?: boolean;
  unread_count?: number;
  favicon_src?: string;
  icon?: () => JSX.Element;
};

export const BaseFeedItem: Component<BaseFeedItemProps> = props => {
  const [local, rest] = splitProps(props, [
    'href',
    'active',
    'title',
    'loading',
    'unread_count',
    'favicon_src',
    'icon',
  ]);

  return (
    <A {...rest} href={local.href} class={feedClasses.item({ active: local.active, class: 'gap-2' })}>
      <div class="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md md:size-5 md:rounded">
        <Switch fallback={<RssIcon />}>
          <Match when={local.favicon_src}>
            <Image fallbackDelay={500} class="size-full">
              <Image.Img class="size-full object-fill" src={local.favicon_src} alt={`${local.title} favicon`} />
              <Image.Fallback as={RssIcon} />
            </Image>
          </Match>

          <Match when={local.icon}>
            <Dynamic component={local.icon} />
          </Match>
        </Switch>

        <Transition
          enterActiveClass="transition duration-50 ease-in-out"
          exitActiveClass="transition duration-50 ease-in-out"
          enterClass="opacity-0"
          exitToClass="opacity-0"
        >
          <Show when={local.loading}>
            <div class="absolute z-10 size-full bg-gray-100/50 backdrop-blur">
              <div class="size-full scale-75">
                <Spinner class="size-full" />
              </div>
            </div>
          </Show>
        </Transition>
      </div>

      <span class="flex-1 overflow-hidden truncate break-all" innerHTML={local.title} />

      <Show when={local.unread_count}>
        <span class="shrink-0 px-1 text-right text-gray-400 text-sm md:text-xs/4 dark:text-gray-300">
          {local.unread_count}
        </span>
      </Show>
    </A>
  );
};

const RssIcon = () => (
  <div class="flex size-full items-center justify-center bg-gray-400 text-white dark:bg-gray-700 dark:text-gray-400">
    <HiOutlineRss class="size-5 md:h-4 md:w-4" />
  </div>
);
