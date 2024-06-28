import { createShortcut } from '@solid-primitives/keyboard';
import { modalOpen, setModalStore } from '~/stores/modal';

const DISALLOWED_NODES = ['input', 'textarea', 'select'] as const;

const shouldIgnoreEvent = (target: EventTarget | null) => {
  if (target instanceof HTMLElement) {
    const nodeName = target.nodeName.toLowerCase();
    return DISALLOWED_NODES.includes(nodeName) || target.isContentEditable;
  }

  return false;
};

export const useShortcuts = () => {
  const handle = (callback: (event?: KeyboardEvent | null) => void) => (event: KeyboardEvent | null) => {
    if (!event) return;
    if (shouldIgnoreEvent(event.target)) return;

    event.preventDefault();
    event.stopPropagation();

    callback(event);
  };

  const handleAddFeed = () => {
    if (modalOpen('addFeed')) return;

    setModalStore('addFeed', true);
  };

  createShortcut(['Shift', 'A'], handle(handleAddFeed), { preventDefault: false, requireReset: true });
};
