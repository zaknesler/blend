import { ToggleGroup } from '@kobalte/core/toggle-group';
import { useNavigate } from '@solidjs/router';
import { createMutation } from '@tanstack/solid-query';
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

  const folders = useFolders();

  const feeds = useFeeds();

  const getFeed = () => {
    const uuid = getModalData('moveFeed')?.feed_uuid;
    if (!uuid) return null;

    return feeds.findFeed(uuid as string);
  };

  const update = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_FOLDERS_UPDATE],
    mutationFn: updateFeedFolders,
  }));

  const [folderUuids, setFolderUuids] = createSignal<string[]>([]);

  const isDisabled = () => update.isPending || !open;

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    // update.mutateAsync({ uuid: props.feed_uuid, folder_uuids: folderUuids() });
  };

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
    <Modal modal="moveFeed" title="Move feed" description="Folders are top-level groups for your feeds.">
      <div class="flex flex-col items-stretch gap-4 p-4">
        <form onSubmit={handleSubmit} class="flex flex-col gap-4">
          <ToggleGroup multiple value={folderUuids()} onChange={setFolderUuids}>
            <For each={folders.query.data}>
              {folder => <ToggleGroup.Item value={folder.uuid}>{folder.label}</ToggleGroup.Item>}
            </For>
          </ToggleGroup>

          <div class="flex items-center justify-between gap-4">
            <Button size="sm" class="self-start" onClick={handleSubmit} disabled={isDisabled()}>
              Move "{getFeed()?.title}"
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
