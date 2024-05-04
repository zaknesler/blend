import { type Component, For, Match, Switch, createSignal } from 'solid-js';
import { Logo } from './logo';
import { CreateFeed } from '../modals/create-feed';
import { cx } from 'class-variance-authority';
import { createQuery } from '@tanstack/solid-query';
import { getFeeds } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { FeedItem } from './feed-item';
import { ContextButton } from './context-button';
import { TiCog } from 'solid-icons/ti';
import { Skeleton } from '../ui/skeleton';

type SidebarProps = {
  class?: string;
};

export const Sidebar: Component<SidebarProps> = props => {
  const [settingsOpen, setSettingsOpen] = createSignal(false);

  const feeds = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS],
    queryFn: getFeeds,
  }));

  return (
    <div class={cx('relative -mr-4 flex h-full flex-col items-stretch gap-8 p-4 dark:bg-gray-950', props.class)}>
      <div class="flex justify-between">
        <Logo />

        <ContextButton
          open={settingsOpen()}
          setOpen={setSettingsOpen}
          triggerIcon={TiCog}
          gutter={-2}
          triggerClass="w-6 h-6"
          triggerIconClass="w-5 h-5 text-gray-500"
        >
          <ContextButton.Item onClick={() => console.log('clicky')}>Settings</ContextButton.Item>
          <ContextButton.Item onClick={() => console.log('clicky')}>Refresh feeds</ContextButton.Item>
        </ContextButton>
      </div>

      <div class="flex w-full flex-col gap-1">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Feeds</h3>
        <Switch>
          <Match when={feeds.isPending}>
            <Skeleton class="h-8" color="light" />
            <Skeleton class="h-8" color="light" />
            <Skeleton class="h-8" color="light" />
            <Skeleton class="h-8" color="light" />
            <Skeleton class="h-8" color="light" />
          </Match>

          <Match when={feeds.isError}>
            <p>Error: {feeds.error?.message}</p>
          </Match>

          <Match when={feeds.isSuccess}>
            {feeds.data?.length ? (
              <For each={feeds.data}>{feed => <FeedItem feed={feed} />}</For>
            ) : (
              <div>No feeds.</div>
            )}
          </Match>
        </Switch>
      </div>

      <CreateFeed triggerClass="absolute bottom-4 right-4" />
    </div>
  );
};
