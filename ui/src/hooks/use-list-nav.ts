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
};

export const useListNav = (params: () => UseListNavParams) => {
  const state = useQueryState();
  const viewport = useViewport();
  const navigate = useNavigate();
  const keyDownEvent = useKeyDownEvent();

  const queryClient = useQueryClient();

  createEffect(() => {
    if (!params().enabled || !params().entryUuids.length || viewport.lteBreakpoint('md')) return;

    const e = keyDownEvent();
    if (!e) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        maybeNavigate('back');
        break;

      case 'ArrowUp':
        e.preventDefault();
        maybeNavigate('next');
        break;
    }
  });

  const getCurrentIndex = () => params().entryUuids.findIndex(uuid => uuid === state.params.entry_uuid);

  const canGoBack = () => getCurrentIndex() > 0;
  const canGoForward = () => getCurrentIndex() < params().entryUuids.length;

  const maybeNavigate = debounce((direction: 'next' | 'back') => {
    const currentIndex = getCurrentIndex();

    const offset = direction === 'back' ? -1 : 1;
    const entry_uuid = params().entryUuids[currentIndex + offset];
    if (!entry_uuid) return;

    const activeItem = findEntryItem(entry_uuid);
    if (activeItem) activeItem.focus();

    // Cancel the current entry view request
    queryClient.cancelQueries({ queryKey: [QUERY_KEYS.ENTRIES_VIEW, state.params.entry_uuid] });

    // Maybe fetch more if we're nearing the end of the list
    if (currentIndex > params().entryUuids.length - 3) params().fetchMore();

    navigate(state.getEntryUrl(entry_uuid));
  }, 30);

  return {
    canGoBack,
    canGoForward,
    maybeNavigate,
  };
};
