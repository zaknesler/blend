import { type KbdKey, createShortcut } from '@solid-primitives/keyboard';
import { useQueryState } from '~/contexts/query-state-context';
import { modalStore, openModal } from '~/stores/modal';
import { View } from '~/types/bindings';
import { useRefreshFeed } from './queries/use-refresh-feed';
import { useRefreshFeeds } from './queries/use-refresh-feeds';

export const SHORTCUTS = {
  OPEN_ADD_FEED_MODAL: ['Shift', 'A'],
  REFRESH_ALL_FEEDS: ['Shift', 'R'],
  REFRESH_CURRENT_FEED: ['R'],
  SWITCH_VIEW_TO_UNREAD: ['1'],
  SWITCH_VIEW_TO_SAVED: ['2'],
  SWITCH_VIEW_TO_ALL: ['3'],
} as const satisfies Record<string, KbdKey[]>;

const DEFAULT_OPTIONS = { preventDefault: false, requireReset: true } as Parameters<typeof createShortcut>[2];

const DISALLOWED_NODES = ['input', 'textarea', 'select'] as const;

const shouldIgnoreEvent = (target: EventTarget | null) => {
  // Ignore event an input element is focused or within an editable element
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
    SHORTCUTS.OPEN_ADD_FEED_MODAL,
    handle(() => openModal('createFeed')),
    DEFAULT_OPTIONS,
  );

  createShortcut(
    SHORTCUTS.REFRESH_CURRENT_FEED,
    handle(() => state.params.feed_uuid && refreshFeed(state.params.feed_uuid)),
    DEFAULT_OPTIONS,
  );

  createShortcut(
    SHORTCUTS.REFRESH_ALL_FEEDS,
    handle(() => refreshFeeds()),
    DEFAULT_OPTIONS,
  );

  createShortcut(
    SHORTCUTS.SWITCH_VIEW_TO_UNREAD,
    handle(() => state.setView(View.Unread)),
    DEFAULT_OPTIONS,
  );

  createShortcut(
    SHORTCUTS.SWITCH_VIEW_TO_SAVED,
    handle(() => state.setView(View.Saved)),
    DEFAULT_OPTIONS,
  );

  createShortcut(
    SHORTCUTS.SWITCH_VIEW_TO_ALL,
    handle(() => state.setView(View.All)),
    DEFAULT_OPTIONS,
  );
};
