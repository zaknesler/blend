import { createStore } from 'solid-js/store';
import { type ModalData, ModalName } from '~/constants/modals';

type ModalType<M extends ModalName> = {
  open: boolean;
  data?: ModalData[M];
};

export const [modalStore, setModalStore] = createStore<{
  [K in ModalName]: ModalType<K>;
}>({
  [ModalName.CreateFeed]: { open: false },
  [ModalName.CreateFolder]: { open: false },
  [ModalName.MoveFeed]: { open: false },
});

export const openModal = <M extends ModalName>(modal: M, data?: ModalData[M]) => {
  // @ts-expect-error weird type thing I can't fix
  setModalStore(modal, { open: true, data });
};

export const closeModal = <M extends ModalName>(modal: M) => {
  // @ts-expect-error weird type thing I can't fix
  setModalStore(modal, { open: false, data: undefined });
};

export const getModalData = <M extends ModalName>(modal: M): ModalData[M] => modalStore[modal].data as ModalData[M];

export const isModalOpen = (modal: ModalName) => modalStore[modal]?.open;
