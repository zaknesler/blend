import { Dialog, type DialogContentProps, type DialogRootProps } from '@kobalte/core/dialog';
import { HiOutlineXMark } from 'solid-icons/hi';
import { type ParentComponent, splitProps } from 'solid-js';
import { modalOpen, type modalStore, setModalStore } from '~/stores/modal';

type ModalProps = Omit<DialogRootProps, 'modal' | 'open' | 'onOpenChange'> &
  Pick<DialogContentProps, 'onOpenAutoFocus'> & {
    modal: keyof typeof modalStore;
    title: string;
    description: string;
  };

export const Modal: ParentComponent<ModalProps> = props => {
  const [local, rest] = splitProps(props, ['title', 'modal', 'description', 'onOpenAutoFocus', 'children']);

  return (
    <Dialog {...rest} open={modalOpen(local.modal)} onOpenChange={value => setModalStore(local.modal, value)}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 animate-overlay-hide ui-expanded:animate-overlay-show bg-black/25 backdrop-blur-md" />

        <div class="fixed inset-0 z-50 flex items-end justify-center p-8 sm:items-center">
          <Dialog.Content
            class="relative z-50 w-full animate-content-hide ui-expanded:animate-content-show overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all sm:max-w-sm dark:border-gray-800 dark:bg-gray-950 dark:shadow-xl"
            onOpenAutoFocus={local.onOpenAutoFocus}
          >
            <Dialog.CloseButton class="absolute top-2 right-2 rounded-lg p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 dark:hover:bg-gray-800">
              <HiOutlineXMark class="size-5 text-gray-500" />
            </Dialog.CloseButton>

            <div class="flex flex-col gap-2 border-b bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
              <Dialog.Title class="font-semibold text-lg/4 dark:text-gray-200">{local.title}</Dialog.Title>
              <Dialog.Description class="text-gray-600 text-sm dark:text-gray-400">
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
