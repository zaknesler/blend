import { type Component, For, Match, Switch } from 'solid-js';
import { useFeeds } from '../hooks/useFeeds';
import { HiOutlineMoon, HiSolidPlus } from 'solid-icons/hi';
import { useNavigate } from '@solidjs/router';
import { Button } from './form/button';
import { Logo } from './logo';
import { Link } from './link';

export const Sidebar: Component = () => {
  const navigate = useNavigate();
  const feeds = useFeeds();

  return (
    <div class="relative flex h-full w-sidebar flex-col items-start gap-8 bg-white p-8 shadow-md">
      <Logo />

      <nav class="flex flex-col items-start gap-2 text-sm">
        <Link href="/">Home</Link>
        <Link href="/articles/test">Article</Link>
      </nav>

      <Button onClick={() => navigate('/new')} class="absolute bottom-4 right-4 inline-flex items-center gap-2 text-sm">
        Add feed
        <HiSolidPlus class="h-4 w-4 text-gray-300" />
      </Button>

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
