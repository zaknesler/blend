import { useNavigate } from '@solidjs/router';
import { createMutation } from '@tanstack/solid-query';
import { Show, createEffect, createSignal } from 'solid-js';
import { getErrorMessage } from '~/api';
import { createFolder } from '~/api/folders';
import { QUERY_KEYS } from '~/constants/query';
import { useInvalidateFolders } from '~/hooks/queries/use-invalidate-folders';
import { modalOpen, setModalStore } from '~/stores/modal';
import { Button } from '../ui/button';
import { TextInput } from '../ui/input';
import { Spinner } from '../ui/spinner';
import { Modal } from './modal';

const formatSlug = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z]+/g, ' ') // Replace all consecutive, non-alphabetic characters with spaces
    .trim()
    .replace(/ +/g, '-'); // Replace all consecutive spaces with a single hyphen

export const CreateFolderModal = () => {
  const navigate = useNavigate();

  const invalidateFolders = useInvalidateFolders();

  const create = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FOLDERS_CREATE],
    mutationFn: createFolder,
  }));

  const [labelValue, setLabelValue] = createSignal('');
  const [slugValue, setSlugValue] = createSignal('');
  const [inputElement, setInputElement] = createSignal<HTMLDivElement>();

  const isDisabled = () => create.isPending || !open;

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!labelValue() || isDisabled()) return;

    const folder = await create.mutateAsync({ label: labelValue(), slug: slugValue() }).catch(() => null);
    if (!folder) return;

    invalidateFolders();
    navigate(`/folder/${folder.slug}`);
    setModalStore('createFolder', false);
  };

  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault();
    inputElement()?.focus();
  };

  // Reset form state on close
  createEffect(() => {
    if (modalOpen('createFolder')) return;

    // Delay 150ms to let animation play out
    setTimeout(() => {
      create.reset();
      setLabelValue('');
    }, 150);
  });

  createEffect(() => {
    setSlugValue(formatSlug(labelValue()));
  });

  return (
    <Modal
      modal="createFolder"
      title="Create new folder"
      description="Folders are top-level groups for your feeds."
      onOpenAutoFocus={handleOpenAutoFocus}
    >
      <div class="flex flex-col items-stretch gap-4 p-4">
        <form onSubmit={handleSubmit} class="flex flex-col gap-4">
          <TextInput
            name="label"
            label="Label"
            value={labelValue()}
            onChange={setLabelValue}
            placeholder="Photography"
            error={create.error}
            ref={setInputElement}
          />

          <TextInput name="slug" label="Slug" value={slugValue()} onChange={setSlugValue} placeholder="photography" />

          <div class="flex items-center justify-between gap-4">
            <Button size="sm" class="self-start" onClick={handleSubmit} disabled={isDisabled()}>
              Create folder
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
