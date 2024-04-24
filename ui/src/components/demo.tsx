import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { type Component, Match, Switch, createSignal } from 'solid-js';
import { addFeed } from '../api/feeds';
import { Button } from './form/button';

export const Demo: Component = () => {
  const queryClient = useQueryClient();
  const [input, setInput] = createSignal('https://blog.rust-lang.org/feed.xml');

  const add = createMutation(() => ({
    mutationKey: ['feed.add'],
    mutationFn: addFeed,
  }));

  const handleClick = async () => {
    if (!input()) return;
    await add.mutateAsync({ url: input() });
    queryClient.invalidateQueries({ queryKey: ['feeds'] });
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
        <Button onClick={handleClick}>Get feed</Button>
      </div>

      <Switch>
        <Match when={add.isPending}>
          <p>Loading...</p>
        </Match>

        <Match when={add.isError}>
          <p>Error: {add.error?.message}</p>
        </Match>

        <Match when={add.isSuccess}>
          <pre>{JSON.stringify(add.data, null, 2)}</pre>
        </Match>
      </Switch>
    </div>
  );
};
