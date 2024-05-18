import { A, useLocation } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiSolidRss } from 'solid-icons/hi';
import { Component, JSX, Setter, createMemo, createSignal } from 'solid-js';
import type { Feed } from '~/types/bindings';
import { MenuFeed } from '../menus/menu-feed';
import { Dynamic } from 'solid-js/web';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';
import { useFilterParams } from '~/hooks/use-filter-params';

type FeedItemProps = {
  feed: Feed;
};

export const FeedItem: Component<FeedItemProps> = props => {
  const location = useLocation();
  const filter = useFilterParams();

  const [open, setOpen] = createSignal(false);

  const { stats } = useFeedsStats();

  const getPath = createMemo(() => `/feeds/${props.feed.uuid}`);
  const isActive = createMemo(() => location.pathname.startsWith(getPath()));
  const getStats = createMemo(() => stats.data?.find(item => item.uuid === props.feed.uuid));

  return (
    <BaseFeedItem
      href={getPath().concat(filter.getQueryString())}
      title={props.feed.title}
      open={open()}
      active={isActive()}
      setOpen={setOpen}
      unread_count={getStats()?.count_unread}
      menu={() => (
        <MenuFeed onlyDisplayForGroup uuid={props.feed.uuid} open={open()} setOpen={setOpen} shift={-5} gutter={8} />
      )}
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
  icon?: () => JSX.Element;
  menu: () => JSX.Element;
};

export const BaseFeedItem: Component<BaseFeedItemProps> = props => (
  <A
    href={props.href}
    class={cx(
      'group -mx-1 flex items-center gap-2 rounded-lg border p-1 text-base no-underline outline-none transition',
      'md:-mx-1 md:rounded-md md:p-1 md:text-sm',
      'text-gray-600 ring-gray-200 dark:text-gray-300 dark:ring-gray-700',
      'focus:border-gray-400 focus:ring-2 dark:focus:border-gray-600',
      props.active
        ? 'border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
        : 'border-transparent hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white',
    )}
  >
    {/* TODO: render favicon */}
    <div class="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md md:h-5 md:w-5 md:rounded">
      {props.icon ? (
        <Dynamic component={props.icon} />
      ) : (
        <div class="flex h-full w-full items-center justify-center bg-gray-400 text-white dark:bg-gray-700 dark:text-gray-400">
          <HiSolidRss class="h-5 w-5 md:h-4 md:w-4" />
        </div>
      )}
    </div>

    <span class="flex-1 overflow-x-hidden truncate">{props.title}</span>

    {props.unread_count && (
      <span class="-mx-1 -my-0.5 w-6 shrink-0 rounded bg-white py-0.5 text-center text-xs/4 text-gray-500 dark:bg-gray-800 dark:text-gray-300">
        {props.unread_count}
      </span>
    )}

    <div class="hidden md:block">
      <Dynamic component={props.menu} />
    </div>
  </A>
);
