import { Image } from '@kobalte/core/image';
import { A, useLocation } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiSolidRss } from 'solid-icons/hi';
import { type Component, type JSX, Match, Show, Switch, createMemo } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Transition } from 'solid-transition-group';
import { useNotifications } from '~/contexts/notification-context';
import { useQueryState } from '~/contexts/query-state-context';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';
import type { Feed } from '~/types/bindings';
import { Spinner } from '../ui/spinner';

type FeedItemProps = {
  feed: Feed;
};

export const FeedItem: Component<FeedItemProps> = props => {
  const state = useQueryState();
  const location = useLocation();

  const { stats } = useFeedsStats();
  const notifications = useNotifications();

  const getPath = createMemo(() => `/feeds/${props.feed.uuid}`);
  const isActive = createMemo(() => location.pathname.startsWith(getPath()));
  const getStats = createMemo(() => stats.data?.find(item => item.uuid === props.feed.uuid));

  const getFaviconSrc = () => props.feed.favicon_b64 || props.feed.favicon_url;

  const isLoading = () => notifications.isFeedRefreshing(props.feed.uuid);

  return (
    <BaseFeedItem
      href={getPath().concat(state.getQueryString())}
      title={props.feed.title_display || props.feed.title}
      active={isActive()}
      loading={isLoading()}
      unread_count={getStats()?.count_unread}
      favicon_src={getFaviconSrc()}
    />
  );
};

type BaseFeedItemProps = {
  href: string;
  active: boolean;
  title?: string;
  loading?: boolean;
  unread_count?: number;
  favicon_src?: string;
  icon?: () => JSX.Element;
};

export const BaseFeedItem: Component<BaseFeedItemProps> = props => (
  <A
    href={props.href}
    class={cx(
      '-mx-1 flex flex-1 select-none items-center gap-2 rounded-lg border p-1 text-base no-underline outline-none transition',
      'md:rounded-md md:p-1 md:text-sm',
      'text-gray-600 ring-gray-200 dark:text-gray-300 dark:ring-gray-700',
      'dark:focus:border-gray-600 focus:border-gray-400',
      props.active
        ? 'border-gray-200 bg-gray-100 text-gray-900 dark:border-gray-700 dark:bg-gray-800 xl:bg-white dark:text-white'
        : 'border-transparent dark:hover:bg-gray-800 hover:bg-gray-200 dark:hover:text-white hover:text-gray-900',
    )}
  >
    <div class="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md md:size-5 md:rounded">
      <Switch fallback={<RssIcon />}>
        <Match when={props.favicon_src}>
          <Image fallbackDelay={500} class="size-full">
            <Image.Img class="size-full object-fill" src={props.favicon_src} alt={`${props.title} favicon`} />
            <Image.Fallback as={RssIcon} />
          </Image>
        </Match>

        <Match when={props.icon}>
          <Dynamic component={props.icon} />
        </Match>
      </Switch>

      <Transition
        enterActiveClass="transition duration-50 ease-in-out"
        exitActiveClass="transition duration-50 ease-in-out"
        enterClass="opacity-0"
        exitToClass="opacity-0"
      >
        <Show when={props.loading}>
          <div class="absolute z-10 size-full bg-gray-100/50 backdrop-blur">
            <div class="size-full scale-75">
              <Spinner class="size-full" />
            </div>
          </div>
        </Show>
      </Transition>
    </div>

    <span class="flex-1 overflow-x-hidden truncate">{props.title}</span>

    <Show when={props.unread_count}>
      <span class="shrink-0 px-1 text-right text-gray-400 text-sm dark:text-gray-300 md:text-xs/4">
        {props.unread_count}
      </span>
    </Show>
  </A>
);

const RssIcon = () => (
  <div class="flex size-full items-center justify-center bg-gray-400 text-white dark:bg-gray-700 dark:text-gray-400">
    <HiSolidRss class="size-5 md:h-4 md:w-4" />
  </div>
);
