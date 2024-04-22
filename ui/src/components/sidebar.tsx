import { For, Match, Switch } from 'solid-js';
import { useFeeds } from '../hooks/useFeeds';

export const Sidebar = () => {
  const feeds = useFeeds();

  return (
    <div class="h-full w-sidebar bg-white p-8 shadow-md">
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
  );
};
