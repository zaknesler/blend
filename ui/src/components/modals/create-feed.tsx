import { Dialog } from '@kobalte/core/dialog';
import { TextField } from '@kobalte/core/text-field';
import { useNavigate } from '@solidjs/router';
import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { HiSolidXMark } from 'solid-icons/hi';
import { type Component, type Setter, createSignal } from 'solid-js';
import { addFeed } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { inputClass } from '~/constants/ui/input';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

type CreateFeedProps = {
  open: boolean;
  setOpen: Setter<boolean>;
};

export const CreateFeedModal: Component<CreateFeedProps> = props => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [value, setValue] = createSignal('');
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
    props.setOpen(false);
    add.reset();
    setValue('');
  };

  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault();
    inputElement()?.focus();
  };

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 animate-overlay-hide bg-black/25 backdrop-blur ui-expanded:animate-overlay-show" />

        <div class="fixed inset-0 z-50 flex items-end justify-center p-8 sm:items-center">
          <Dialog.Content
            class="z-50 w-full animate-content-hide overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all md:max-w-sm ui-expanded:animate-content-show dark:border-gray-700 dark:bg-gray-950"
            onOpenAutoFocus={handleOpenAutoFocus}
          >
            <div class="flex flex-col gap-2 border-b bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
              <div class="flex items-baseline justify-between gap-4">
                <Dialog.Title class="font-semibold text-lg/4 dark:text-gray-200">Add a new feed</Dialog.Title>

                <Dialog.CloseButton class="rounded-lg p-1 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2">
                  <HiSolidXMark class="h-5 w-5 text-gray-500" />
                </Dialog.CloseButton>
              </div>
              <Dialog.Description class="text-gray-600 text-sm dark:text-gray-400">
                Add an RSS feed link or the website's URL. Feed entries will be fetched in the background.
              </Dialog.Description>
            </div>

            <div class="flex flex-col items-stretch gap-4 p-4">
              <form onSubmit={handleSubmit} class="flex flex-col gap-4">
                <TextField value={value()} onChange={setValue} class="flex flex-col items-stretch gap-1">
                  <TextField.Label class="text-gray-600 text-sm dark:text-gray-400">URL</TextField.Label>
                  <TextField.Input
                    ref={setInputElement}
                    class={inputClass({ disabled: isDisabled() })}
                    placeholder="https://example.com/feed.xml"
                  />
                </TextField>

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
    </Dialog>
  );
};
