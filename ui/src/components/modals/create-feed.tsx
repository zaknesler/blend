import { As, Dialog, TextField } from '@kobalte/core';
import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { HiSolidPlus, HiSolidXMark } from 'solid-icons/hi';
import { Component, Match, Switch, createSignal } from 'solid-js';
import { addFeed } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { inputClass } from '~/constants/ui/input';
import { Button } from '../ui/button';
import { cx } from 'class-variance-authority';

type CreateFeedProps = {
  triggerClass?: string;
};

export const CreateFeed: Component<CreateFeedProps> = ({ triggerClass }) => {
  const queryClient = useQueryClient();

  const [value, setValue] = createSignal('https://blog.rust-lang.org/feed.xml');
  const [inputElement, setInputElement] = createSignal<HTMLDivElement>();

  const add = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_ADD],
    mutationFn: addFeed,
  }));

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!value()) return;

    await add.mutateAsync({ url: value() });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
  };

  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault();
    inputElement()?.focus();
  };

  const handleOpenChange = (open: boolean) => {
    if (open) add.reset();
  };

  return (
    <>
      <Dialog.Root onOpenChange={handleOpenChange}>
        <Dialog.Trigger asChild>
          <As component={Button} class={cx('inline-flex items-center gap-2 text-sm', triggerClass)} size="sm">
            Add feed
            <HiSolidPlus class="h-4 w-4 text-gray-300" />
          </As>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay class="animate-overlayHide ui-expanded:animate-overlayShow fixed inset-0 z-50 bg-black/25 backdrop-blur" />

          <div class="fixed inset-0 z-50 flex items-end justify-center p-8 sm:items-center">
            <Dialog.Content
              class="animate-contentHide ui-expanded:animate-contentShow z-50 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all md:max-w-sm"
              onOpenAutoFocus={handleOpenAutoFocus}
            >
              <div class="flex flex-col gap-2 border-b bg-gray-50 p-4">
                <div class="flex items-baseline justify-between gap-4">
                  <Dialog.Title class="text-lg/4 font-semibold">Add a new feed</Dialog.Title>

                  <Dialog.CloseButton class="rounded-lg p-1 hover:bg-gray-200 focus:outline-none focus:ring-2">
                    <HiSolidXMark class="h-5 w-5 text-gray-500" />
                  </Dialog.CloseButton>
                </div>
                <Dialog.Description class="text-sm text-gray-600">
                  Feed entries will be fetched in the background.
                </Dialog.Description>
              </div>

              <div class="flex flex-col items-stretch gap-4 p-4">
                <form onSubmit={handleSubmit} class="flex flex-col gap-4">
                  <TextField.Root value={value()} onChange={setValue} class="flex flex-col items-stretch gap-1">
                    <TextField.Label class="text-sm text-gray-600">URL</TextField.Label>
                    <TextField.Input
                      ref={setInputElement}
                      class={inputClass()}
                      placeholder="https://example.com/feed.xml"
                    />
                  </TextField.Root>

                  <Button size="sm" class="self-start" onClick={handleSubmit}>
                    Add feed
                  </Button>
                </form>

                <Switch>
                  <Match when={add.isPending}>
                    <p>Loading...</p>
                  </Match>

                  <Match when={add.isError}>
                    <p>Error: {add.error?.message}</p>
                  </Match>

                  <Match when={add.isSuccess}>
                    <pre class="w-full overflow-x-auto">{JSON.stringify(add.data, null, 2)}</pre>
                  </Match>
                </Switch>
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
