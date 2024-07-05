import { createShortcut } from '@solid-primitives/keyboard';
import { useQueryState } from '~/contexts/query-state-context';
import { modalOpen, modalStore, setModalStore } from '~/stores/modal';
import { View } from '~/types/bindings';
import { useRefreshFeed } from './queries/use-refresh-feed';
import { useRefreshFeeds } from './queries/use-refresh-feeds';

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
  const refreshFeed = useRefreshFeed();
  const refreshFeeds = useRefreshFeeds();

  const handle = (callback: (event?: KeyboardEvent | null) => void) => (event: KeyboardEvent | null) => {
    if (!event) return;
    if (shouldIgnoreEvent(event.target)) return;

    event.preventDefault();
    event.stopPropagation();

    // Ignore all shortcuts if a modal is open
    if (Object.values(modalStore).some(Boolean)) return;

    callback(event);
  };

  createShortcut(
    ['Shift', 'A'],
    handle(() => setModalStore('addFeed', true)),
    { preventDefault: false, requireReset: true },
  );

  createShortcut(
    ['R'],
    handle(() => state.params.feed_uuid && refreshFeed.refreshFeed(state.params.feed_uuid)),
    { preventDefault: false, requireReset: true },
  );

  createShortcut(
    ['Shift', 'R'],
    handle(() => refreshFeeds.refreshFeeds()),
    { preventDefault: false, requireReset: true },
  );

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
