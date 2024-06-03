import { createShortcut } from '@solid-primitives/keyboard';
import { setModalStore } from '~/stores/modal';

export const useShortcuts = () => {
  createShortcut(
    ['Alt', 'Shift', 'A'],
    () => {
      setModalStore('addFeed', true);
    },
    { preventDefault: true, requireReset: true },
  );
};
