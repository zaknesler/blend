import { createStore } from 'solid-js/store';

export type ModalName = 'createFeed' | 'createFolder' | 'moveFeed';

type ModalType = {
  open: boolean;
  data?: Record<string, unknown>;
};

export const [modalStore, setModalStore] = createStore<Record<ModalName, ModalType>>({
  createFeed: { open: false },
  createFolder: { open: false },
  moveFeed: { open: false },
});

export const openModal = (modal: ModalName, data?: Record<string, unknown>) => {
  setModalStore(modal, { open: true, data });
};

export const closeModal = (modal: ModalName) => {
  setModalStore(modal, { open: false, data: undefined });
};

export const getModalData = (modal: ModalName) => modalStore[modal]?.data;

export const isModalOpen = (modal: ModalName) => modalStore[modal]?.open;
