import { As, Dialog, TextField } from '@kobalte/core';
import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { HiSolidPlus, HiSolidXMark } from 'solid-icons/hi';
import { Component, createSignal } from 'solid-js';
import { addFeed } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { inputClass } from '~/constants/ui/input';
import { Button } from '../ui/button';
import { cx } from 'class-variance-authority';
import { useNavigate } from '@solidjs/router';
import { Spinner } from '../ui/spinner';

type CreateFeedProps = {
  triggerClass?: string;
};

export const CreateFeed: Component<CreateFeedProps> = props => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [open, setOpen] = createSignal(false);
  const [value, setValue] = createSignal('https://blog.rust-lang.org/feed.xml');
  const [inputElement, setInputElement] = createSignal<HTMLDivElement>();

  const add = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_ADD],
    mutationFn: addFeed,
  }));

  const isDisabled = () => add.isPending || !open;

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!value() || isDisabled()) return;

    const feed = await add.mutateAsync({ url: value() });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
    navigate(`/feeds/${feed.uuid}`);
    add.reset();
    setOpen(false);
  };

  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault();
    inputElement()?.focus();
  };

  return (
    <>
      <Dialog.Root open={open()} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <As
            component={Button}
            class={cx('inline-flex items-center gap-2 text-sm', props.triggerClass)}
            size="sm"
            disabled={isDisabled()}
          >
            Add feed
            <HiSolidPlus class="h-4 w-4 text-gray-300" />
          </As>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay class="fixed inset-0 z-50 animate-overlayHide bg-black/25 backdrop-blur ui-expanded:animate-overlayShow" />

          <div class="fixed inset-0 z-50 flex items-end justify-center p-8 sm:items-center">
            <Dialog.Content
              class="z-50 w-full animate-contentHide overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all ui-expanded:animate-contentShow md:max-w-sm"
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
                      class={inputClass({ disabled: isDisabled() })}
                      placeholder="https://example.com/feed.xml"
                    />
                  </TextField.Root>

                  <div class="flex items-center justify-between gap-4">
                    <Button size="sm" class="self-start" onClick={handleSubmit} disabled={isDisabled()}>
                      Add feed
                    </Button>

                    {isDisabled() && <Spinner />}
                  </div>
                </form>

                {add.isError && <p>Error: {add.error?.message}</p>}
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
