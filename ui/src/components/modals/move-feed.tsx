import { ToggleGroup } from '@kobalte/core/toggle-group';
import { useNavigate } from '@solidjs/router';
import { createMutation } from '@tanstack/solid-query';
import { cx } from 'class-variance-authority';
import { HiOutlineCheckCircle, HiSolidCheckCircle } from 'solid-icons/hi';
import { For, Show, createEffect, createSignal } from 'solid-js';
import { getErrorMessage } from '~/api';
import { updateFeedFolders } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { useFolders } from '~/hooks/queries/use-folders';
import { getModalData, isModalOpen } from '~/stores/modal';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { Modal } from './modal';

export const MoveFeedModal = () => {
  const navigate = useNavigate();

  const feeds = useFeeds();
  const folders = useFolders();

  const getFeed = () => feeds.findFeed(getModalData('moveFeed').feed_uuid);

  const update = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_FOLDERS_UPDATE],
    mutationFn: updateFeedFolders,
  }));

  const isDisabled = () => update.isPending || !open;

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    update.mutateAsync({ uuid: getModalData('moveFeed').feed_uuid, folder_uuids: folderUuids() });
  };

  const [folderUuids, setFolderUuids] = createSignal<string[]>([]);

  // Reset form state on close
  createEffect(() => {
    if (isModalOpen('moveFeed')) return;

    // Delay 150ms to let animation play out
    setTimeout(() => {
      update.reset();
      setFolderUuids([]);
    }, 150);
  });

  return (
    <Modal
      modal="moveFeed"
      title={`Move "${getFeed()?.title}"`}
      description="Keep your feeds organized using folders. You may include a feed in multiple folders."
    >
      <div class="flex flex-col items-stretch gap-4 p-4">
        <form onSubmit={handleSubmit} class="flex flex-col gap-4">
          <ToggleGroup
            multiple
            value={folderUuids()}
            onChange={setFolderUuids}
            orientation="vertical"
            class="flex flex-col gap-2"
          >
            <For each={folders.query.data}>
              {folder => (
                <ToggleGroup.Item
                  value={folder.uuid}
                  class={cx(
                    'group flex items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 outline-2 outline-offset-2 focus-visible:outline',
                    'ui-pressed:border-gray-400 bg-gray-50',
                    'dark:border-gray-700 dark:ui-pressed:border-gray-600 dark:bg-gray-800 dark:text-gray-200',
                    folderUuids().length && 'ui-not-pressed:opacity-50',
                  )}
                >
                  <span>{folder.label}</span>
                  <HiSolidCheckCircle class="size-6 text-gray-500 opacity-0 ui-group-pressed:opacity-100 dark:text-gray-400" />
                </ToggleGroup.Item>
              )}
            </For>
          </ToggleGroup>

          <div class="flex items-center justify-between gap-4">
            <Button size="sm" class="self-start" onClick={handleSubmit} disabled={isDisabled()}>
              Move{' '}
              <Show when={folderUuids().length !== 0}>
                to{' '}
                {folderUuids().length === 1
                  ? folders.findByUuid(folderUuids()[0])?.label
                  : `${folderUuids().length} folders`}
              </Show>
            </Button>

            <Show when={isDisabled()}>
              <Spinner />
            </Show>
          </div>
        </form>

        <Show when={update.isError && getErrorMessage(update.error)}>
          <p class="font-medium text-red-700 text-sm dark:text-red-500">Error: {getErrorMessage(update.error)}</p>
        </Show>
      </div>
    </Modal>
  );
};
