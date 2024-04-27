import { type Component, For, Match, Switch } from 'solid-js';
import { useFeeds } from '../hooks/useFeeds';
import { HiOutlineMoon } from 'solid-icons/hi';
import { Logo } from './logo';
import { Link } from './link';
import { CreateFeed } from './modals/create-feed';
import { cx } from 'class-variance-authority';

type SidebarProps = {
  class?: string;
};

export const Sidebar: Component<SidebarProps> = ({ class: className }) => {
  const feeds = useFeeds();

  return (
    <div class={cx('relative flex h-full flex-col items-start gap-8 bg-white p-8 shadow-md', className)}>
      <Logo />

      <nav class="flex flex-col items-start gap-2 text-sm">
        <Link href="/">Home</Link>
        <Link href="/articles/test">Article</Link>
      </nav>

      <CreateFeed triggerClass="absolute bottom-4 right-4" />

      <button class="absolute bottom-4 left-4 appearance-none rounded-lg bg-gray-100 p-2 transition duration-100 hover:bg-gray-200">
        <HiOutlineMoon class="h-6 w-6 text-gray-500" />
      </button>

      <div class="flex flex-col items-start gap-2">
        <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-600">Feeds</h3>
        <Switch>
          <Match when={feeds.isPending}>
            <p>Loading...</p>
          </Match>

          <Match when={feeds.isError}>
            <p>Error: {feeds.error?.message}</p>
          </Match>

          <Match when={feeds.isSuccess}>
            <For each={feeds.data}>{feed => <div>{feed.title}</div>}</For>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
