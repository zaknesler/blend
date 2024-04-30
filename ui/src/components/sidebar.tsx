import { type Component, For, Match, Switch } from 'solid-js';
import { Logo } from './logo';
import { Link } from './link';
import { CreateFeed } from './modals/create-feed';
import { cx } from 'class-variance-authority';
import { A } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { getFeeds } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';

type SidebarProps = {
  class?: string;
};

export const Sidebar: Component<SidebarProps> = props => {
  const feeds = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS],
    queryFn: getFeeds,
  }));

  return (
    <div
      class={cx('relative flex h-full flex-col items-start gap-8 bg-white p-8 shadow-md dark:bg-gray-950', props.class)}
    >
      <Logo />

      <nav class="flex flex-col items-start gap-2 text-sm">
        <Link href="/">Home</Link>
        <Link href="/article">Article</Link>
      </nav>

      <div class="flex flex-col items-start gap-2">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Feeds</h3>
        <Switch>
          <Match when={feeds.isPending}>
            <p>Loading...</p>
          </Match>

          <Match when={feeds.isError}>
            <p>Error: {feeds.error?.message}</p>
          </Match>

          <Match when={feeds.isSuccess}>
            <For each={feeds.data}>
              {feed => (
                <A
                  href={`/feeds/${feed.uuid}`}
                  class="text-gray-800 hover:underline dark:text-gray-100 dark:hover:text-white"
                >
                  {feed.title}
                </A>
              )}
            </For>
          </Match>
        </Switch>
      </div>

      <CreateFeed triggerClass="absolute bottom-4 right-4" />
    </div>
  );
};
