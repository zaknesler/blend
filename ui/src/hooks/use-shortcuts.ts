import { createShortcut } from '@solid-primitives/keyboard';
import { useQueryState } from '~/contexts/query-state-context';
import { modalOpen, setModalStore } from '~/stores/modal';
import { View } from '~/types/bindings';

const DISALLOWED_NODES = ['input', 'textarea', 'select'] as const;

const shouldIgnoreEvent = (target: EventTarget | null) => {
  if (target instanceof HTMLElement) {
    const nodeName = target.nodeName.toLowerCase();
    return DISALLOWED_NODES.includes(nodeName) || target.isContentEditable;
  }

  return false;
};

export const useShortcuts = () => {
  const state = useQueryState();

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
  createShortcut(
    ['1'],
    handle(() => state.setView(View.Unread)),
    { preventDefault: false, requireReset: true },
  );
  createShortcut(
    ['2'],
    handle(() => state.setView(View.Saved)),
    { preventDefault: false, requireReset: true },
  );
  createShortcut(
    ['3'],
    handle(() => state.setView(View.All)),
    { preventDefault: false, requireReset: true },
  );
};
