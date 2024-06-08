import { useKeyDownEvent } from '@solid-primitives/keyboard';
import { debounce } from '@solid-primitives/scheduled';
import { useNavigate } from '@solidjs/router';
import { useQueryClient } from '@tanstack/solid-query';
import { createEffect } from 'solid-js';
import { QUERY_KEYS } from '~/constants/query';
import { findEntryItem } from '~/utils/entries';
import { useQueryState } from '../contexts/query-state-context';
import { useViewport } from '../contexts/viewport-context';

type UseListNavParams = {
  enabled: boolean;
  entryUuids: string[];
  fetchMore: () => void;
  hasNextPage: boolean;
};

export const useListNav = (params: () => UseListNavParams) => {
  const state = useQueryState();
  const viewport = useViewport();
  const navigate = useNavigate();
  const keyDownEvent = useKeyDownEvent();

  const queryClient = useQueryClient();

  // Listen to each keypress to check if the user is attempting to navigate using the arrow keys
  createEffect(() => {
    if (!params().enabled || !params().entryUuids.length) return;

    const e = keyDownEvent();
    if (!e) return;

    if (viewport.lteBreakpoint('md')) {
      // Don't listen to any navigation on mobile when not viewing an entry
      if (!state.params.entry_uuid) return;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          maybeNavigate('next');
          break;

        case 'ArrowLeft':
          e.preventDefault();
          maybeNavigate('back');
          break;
      }

      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        maybeNavigate('next');
        break;

      case 'ArrowUp':
        e.preventDefault();
        maybeNavigate('back');
        break;
    }
  });

  const getCurrentIndex = () => params().entryUuids.findIndex(uuid => uuid === state.params.entry_uuid);

  const canGoBack = () => getCurrentIndex() > 0;
  const canGoForward = () => getCurrentIndex() < params().entryUuids.length - 1;

  const maybeNavigate = debounce((direction: 'next' | 'back') => {
    const currentIndex = getCurrentIndex();

    const offset = direction === 'back' ? -1 : 1;
    const entry_uuid = params().entryUuids[currentIndex + offset];
    if (!entry_uuid) return;

    const activeItem = findEntryItem(entry_uuid);
    if (activeItem) activeItem.focus();

    // Cancel the current entry view request
    queryClient.cancelQueries({ queryKey: [QUERY_KEYS.ENTRIES_VIEW, state.params.entry_uuid] });

    // Fetch more if we're nearing the end of the list
    if (currentIndex > params().entryUuids.length - 3) params().fetchMore();

    navigate(state.getEntryUrl(entry_uuid));
  }, 30);

  return {
    canGoBack,
    canGoForward,
    maybeNavigate,
  };
};
