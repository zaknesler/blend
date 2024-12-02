import { createStore } from 'solid-js/store';

export type ModalData = {
  createFeed: undefined;
  createFolder: undefined;
  moveFeed: { feed_uuid: string };
};

export type ModalName = keyof ModalData;

type ModalType<M extends ModalName> = {
  open: boolean;
  data?: ModalData[M];
};

export const [modalStore, setModalStore] = createStore<{
  [K in ModalName]: ModalType<K>;
}>({
  createFeed: { open: false },
  createFolder: { open: false },
  moveFeed: { open: false },
});

export const openModal = <M extends ModalName>(modal: M, data?: ModalData[M]) => {
  // @ts-ignore weird type thing I can't fix
  setModalStore(modal, { open: true, data });
};

export const closeModal = <M extends ModalName>(modal: M) => {
  // @ts-ignore weird type thing I can't fix
  setModalStore(modal, { open: false, data: undefined });
};

// @ts-ignore weird type thing I can't fix
export const getModalData = <M extends ModalName>(modal: M): ModalData[M] => modalStore[modal]?.data;

export const isModalOpen = (modal: ModalName) => modalStore[modal]?.open;
