import { A, useLocation } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiSolidRss } from 'solid-icons/hi';
import { Component, createMemo, createSignal } from 'solid-js';
import { Feed } from '~/types/bindings/feed';
import { createQuery } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';
import { getFeedStats } from '~/api/feeds';
import { FeedMenu } from './feed-menu';

type FeedItemProps = {
  feed: Feed;
};

export const FeedItem: Component<FeedItemProps> = props => {
  const location = useLocation();
  const [open, setOpen] = createSignal(false);

  const stats = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_STATS],
    queryFn: getFeedStats,
  }));

  const getPath = createMemo(() => `/feeds/${props.feed.uuid}`);
  const isActive = createMemo(() => location.pathname.startsWith(getPath()));
  const getStats = createMemo(() => stats.data?.find(item => item.uuid === props.feed.uuid));

  return (
    <A
      href={getPath()}
      class={cx(
        'group -mx-1 flex items-center gap-2 rounded-md border p-1 text-sm no-underline outline-none transition',
        'text-gray-600 ring-gray-200 dark:text-gray-300 dark:ring-gray-700',
        'hover:border-gray-200 hover:bg-white hover:text-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white',
        'focus:border-gray-400 focus:ring-2 dark:focus:border-gray-600',
        'focus-within:border-gray-300 focus-within:bg-white dark:focus-within:border-gray-700 dark:focus-within:bg-gray-800',
        isActive() || open()
          ? 'border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
          : 'border-transparent',
      )}
    >
      <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-400 text-white dark:bg-gray-700 dark:text-gray-400">
        <HiSolidRss class="h-4 w-4" />
      </div>

      <span class="flex-1 overflow-x-hidden truncate">{props.feed.title}</span>

      {getStats()?.count_unread && (
        <span class="-mx-1 -my-0.5 w-6 shrink-0 rounded-md bg-white py-0.5 text-center text-xs/4 text-gray-500 dark:bg-gray-800 dark:text-gray-300">
          {getStats()?.count_unread}
        </span>
      )}

      <FeedMenu uuid={props.feed.uuid} onlyDisplayForGroup open={open()} setOpen={setOpen} shift={-6} gutter={8} />
    </A>
  );
};
