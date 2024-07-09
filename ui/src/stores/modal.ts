import { createStore } from 'solid-js/store';

export const [modalStore, setModalStore] = createStore({
  createFeed: false,
  createFolder: false,
});

export const modalOpen = (modal: keyof typeof modalStore) => modalStore[modal];
