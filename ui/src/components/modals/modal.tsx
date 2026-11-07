import { Dialog, type DialogContentProps, type DialogRootProps } from '@kobalte/core/dialog';
import { HiOutlineXMark } from 'solid-icons/hi';
import { type ParentProps, splitProps } from 'solid-js';
import type { ModalName } from '~/constants/modals';
import { isModalOpen, setModalStore } from '~/stores/modal';

type ModalProps = Omit<DialogRootProps, 'modal' | 'open' | 'onOpenChange'> &
  Pick<DialogContentProps, 'onOpenAutoFocus'> & {
    modal: ModalName;
    title: string;
    description: string;
  };

export const Modal = (props: ParentProps<ModalProps>) => {
  const [local, rest] = splitProps(props, ['title', 'modal', 'description', 'onOpenAutoFocus', 'children']);

  return (
    <Dialog
      {...rest}
      open={isModalOpen(local.modal)}
      onOpenChange={value => setModalStore(local.modal, { open: value })}
    >
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 animate-overlay-hide bg-black/25 backdrop-blur-xs ui-expanded:animate-overlay-show" />

        <div class="fixed inset-0 z-50 flex items-end justify-center p-8 sm:items-center">
          <Dialog.Content
            class="relative z-50 w-full animate-content-hide overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all sm:max-w-sm dark:border-gray-800 dark:bg-gray-950 dark:shadow-xl ui-expanded:animate-content-show"
            onOpenAutoFocus={local.onOpenAutoFocus}
          >
            <Dialog.CloseButton class="absolute top-2 right-2 rounded-lg p-1 text-gray-500 ring-gray-400 transition hover:bg-gray-200 focus-visible:bg-gray-200 focus-visible:ring-2 focus-visible:outline-none dark:text-gray-400 dark:ring-gray-600 dark:hover:bg-gray-700 dark:focus-visible:bg-gray-700">
              <HiOutlineXMark class="size-5" />
            </Dialog.CloseButton>

            <div class="flex flex-col gap-2 border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
              <Dialog.Title class="text-base font-semibold dark:text-gray-200">{local.title}</Dialog.Title>
              <Dialog.Description class="text-sm text-gray-600 dark:text-gray-400">
                {local.description}
              </Dialog.Description>
            </div>

            {local.children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog>
  );
};
