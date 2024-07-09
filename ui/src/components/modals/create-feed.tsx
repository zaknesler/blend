import { useNavigate } from '@solidjs/router';
import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { Show, createEffect, createSignal } from 'solid-js';
import { getErrorMessage } from '~/api';
import { createFeed } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { modalOpen, setModalStore } from '~/stores/modal';
import { Button } from '../ui/button';
import { TextInput } from '../ui/input';
import { Spinner } from '../ui/spinner';
import { Modal } from './modal';

export const CreateFeedModal = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [value, setValue] = createSignal('');
  const [inputElement, setInputElement] = createSignal<HTMLDivElement>();

  const create = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_CREATE],
    mutationFn: createFeed,
  }));

  const isDisabled = () => create.isPending || !open;

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!value() || isDisabled()) return;

    const feed = await create.mutateAsync({ url: value() }).catch(() => null);
    if (!feed) return;

    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
    navigate(`/feeds/${feed.uuid}`);
    setModalStore('createFeed', false);
  };

  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault();
    inputElement()?.focus();
  };

  // Reset form state on close
  createEffect(() => {
    if (modalOpen('createFeed')) return;

    // Delay 150ms to let animation play out
    setTimeout(() => {
      create.reset();
      setValue('');
    }, 150);
  });

  return (
    <Modal
      modal="createFeed"
      title="Add a new feed"
      description="Add an RSS feed link or the website's URL. Feed entries will be fetched in the background."
      onOpenAutoFocus={handleOpenAutoFocus}
    >
      <div class="flex flex-col items-stretch gap-4 p-4">
        <form onSubmit={handleSubmit} class="flex flex-col gap-4">
          <TextInput
            name="url"
            label="URL"
            value={value()}
            onChange={setValue}
            placeholder="https://example.com/feed.xml"
            error={create.error}
            ref={setInputElement}
          />

          <div class="flex items-center justify-between gap-4">
            <Button size="sm" class="self-start" onClick={handleSubmit} disabled={isDisabled()}>
              Add feed
            </Button>

            <Show when={isDisabled()}>
              <Spinner />
            </Show>
          </div>
        </form>

        <Show when={create.isError && getErrorMessage(create.error)}>
          <p class="font-medium text-red-700 text-sm dark:text-red-500">Error: {getErrorMessage(create.error)}</p>
        </Show>
      </div>
    </Modal>
  );
};
