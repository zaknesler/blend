import { createMutation } from '@tanstack/solid-query';
import { Match, Switch, createSignal } from 'solid-js';
import { parseFeed } from '../api/feeds';

export const Demo = () => {
  const [input, setInput] = createSignal('https://blog.rust-lang.org/feed.xml');

  const parse = createMutation(() => ({
    mutationKey: ['feed.parse'],
    mutationFn: parseFeed,
  }));

  const handleClick = async () => {
    if (!input()) return;
    parse.mutateAsync({ url: input() });
  };

  return (
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <input
          type="text"
          value={input()}
          onChange={e => setInput(e.target.value)}
          class="w-full rounded-md px-3 py-2 font-sans text-sm"
        />
        <button
          onClick={handleClick}
          class="flex-shrink-0 rounded-md bg-gray-500 px-4 py-2 font-sans text-sm font-semibold text-white"
        >
          Get feed
        </button>
      </div>

      <Switch>
        <Match when={parse.isPending}>
          <p>Loading...</p>
        </Match>

        <Match when={parse.isError}>
          <p>Error: {parse.error?.message}</p>
        </Match>

        <Match when={parse.isSuccess}>
          <pre>{JSON.stringify(parse.data, null, 2)}</pre>
        </Match>
      </Switch>
    </div>
  );
};
