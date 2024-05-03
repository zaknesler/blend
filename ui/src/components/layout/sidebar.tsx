import { type Component, For, Match, Switch } from 'solid-js';
import { Logo } from './logo';
import { Link } from '../ui/link';
import { CreateFeed } from '../modals/create-feed';
import { cx } from 'class-variance-authority';
import { createQuery } from '@tanstack/solid-query';
import { getFeeds } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { FeedItem } from './feed-item';

type SidebarProps = {
  class?: string;
};

export const Sidebar: Component<SidebarProps> = props => {
  const feeds = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS],
    queryFn: getFeeds,
  }));

  return (
    <div class={cx('relative -mr-4 flex h-full flex-col items-start gap-8 p-4 dark:bg-gray-950', props.class)}>
      <Logo />

      <nav class="flex flex-col items-start gap-2 text-sm">
        <Link href="/">Home</Link>
        <Link href="/article">Article</Link>
      </nav>

      <div class="flex w-full flex-col  gap-1">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Feeds</h3>
        <Switch>
          <Match when={feeds.isPending}>
            <p>Loading...</p>
          </Match>

          <Match when={feeds.isError}>
            <p>Error: {feeds.error?.message}</p>
          </Match>

          <Match when={feeds.isSuccess}>
            <For each={feeds.data}>{feed => <FeedItem feed={feed} />}</For>
          </Match>
        </Switch>
      </div>

      <CreateFeed triggerClass="absolute bottom-4 right-4" />
    </div>
  );
};
