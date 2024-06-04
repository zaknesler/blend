import { createShortcut } from '@solid-primitives/keyboard';
import { setModalStore } from '~/stores/modal';

export const useShortcuts = () => {
  const handleAddFeed = () => {
    setModalStore('addFeed', true);
  };

  createShortcut(['Alt', 'Shift', 'A'], handleAddFeed, { preventDefault: true, requireReset: true });
  createShortcut(['Meta', 'Shift', 'A'], handleAddFeed, { preventDefault: true, requireReset: true });
};
