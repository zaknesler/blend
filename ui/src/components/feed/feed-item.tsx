import { Image } from '@kobalte/core/image';
import { A, useLocation } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiSolidRss } from 'solid-icons/hi';
import { type Component, type JSX, Match, type Setter, Show, Switch, createMemo, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';
import { useQueryState } from '~/hooks/use-query-state';
import type { Feed } from '~/types/bindings';

type FeedItemProps = {
  feed: Feed;
};

export const FeedItem: Component<FeedItemProps> = props => {
  const location = useLocation();
  const state = useQueryState();

  const [open, setOpen] = createSignal(false);

  const { stats } = useFeedsStats();

  const getPath = createMemo(() => `/feeds/${props.feed.uuid}`);
  const isActive = createMemo(() => location.pathname.startsWith(getPath()));
  const getStats = createMemo(() => stats.data?.find(item => item.uuid === props.feed.uuid));

  const getFaviconSrc = () => props.feed.favicon_b64 || props.feed.favicon_url;

  return (
    <BaseFeedItem
      href={getPath().concat(state.getQueryString())}
      title={props.feed.title_display || props.feed.title}
      open={open()}
      active={isActive()}
      setOpen={setOpen}
      unread_count={getStats()?.count_unread}
      favicon_src={getFaviconSrc()}
    />
  );
};

type BaseFeedItemProps = {
  href: string;
  unread_count?: number;
  title?: string;
  active: boolean;
  open: boolean;
  setOpen: Setter<boolean>;
  favicon_src?: string;
  icon?: () => JSX.Element;
};

export const BaseFeedItem: Component<BaseFeedItemProps> = props => (
  <A
    href={props.href}
    class={cx(
      'group -mx-1 flex select-none items-center gap-2 rounded-lg border p-1 text-base no-underline outline-none transition',
      'md:-mx-1 md:rounded-md md:p-1 md:text-sm',
      'text-gray-600 ring-gray-200 dark:text-gray-300 dark:ring-gray-700',
      'dark:focus:border-gray-600 focus:border-gray-400',
      props.active
        ? 'border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
        : 'border-transparent dark:hover:bg-gray-800 hover:bg-gray-200 dark:hover:text-white hover:text-gray-900',
    )}
  >
    <div class="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md md:h-5 md:w-5 md:rounded">
      <Switch fallback={<RssIcon />}>
        <Match when={props.favicon_src}>
          <Image fallbackDelay={500} class="h-full w-full">
            <Image.Img class="h-full w-full object-fill" src={props.favicon_src} alt={`${props.title} favicon`} />
            <Image.Fallback as={RssIcon} />
          </Image>
        </Match>

        <Match when={props.icon}>
          <Dynamic component={props.icon} />
        </Match>
      </Switch>
    </div>

    <span class="flex-1 overflow-x-hidden truncate">{props.title}</span>

    <Show when={props.unread_count}>
      <span class="min-w-6 shrink-0 rounded px-1 py-0.5 text-center text-gray-500 text-sm md:bg-white md:dark:bg-gray-800 dark:text-gray-300 md:text-xs/4">
        {props.unread_count}
      </span>
    </Show>
  </A>
);

const RssIcon = () => (
  <div class="flex h-full w-full items-center justify-center bg-gray-400 text-white dark:bg-gray-700 dark:text-gray-400">
    <HiSolidRss class="h-5 w-5 md:h-4 md:w-4" />
  </div>
);
