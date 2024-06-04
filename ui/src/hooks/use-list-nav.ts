import { useKeyDownEvent } from '@solid-primitives/keyboard';
import { debounce } from '@solid-primitives/scheduled';
import { useNavigate } from '@solidjs/router';
import { useQueryClient } from '@tanstack/solid-query';
import { createEffect } from 'solid-js';
import { QUERY_KEYS } from '~/constants/query';
import type { Entry } from '~/types/bindings';
import { findEntryItem } from '~/utils/entries';
import { useQueryState } from '../contexts/query-state-context';
import { useViewport } from './use-viewport';

type UseListNavParams = {
  enabled: boolean;
  entries: Entry[];
};

export const useListNav = (params: () => UseListNavParams) => {
  const state = useQueryState();
  const viewport = useViewport();
  const navigate = useNavigate();
  const keyDownEvent = useKeyDownEvent();

  const queryClient = useQueryClient();

  createEffect(() => {
    if (!params().entries.length || viewport.lteBreakpoint('md') || !params().enabled) return;

    const e = keyDownEvent();
    if (!e) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        maybeNavigate('down');
        break;

      case 'ArrowUp':
        e.preventDefault();
        maybeNavigate('up');
        break;
    }
  });

  const maybeNavigate = debounce((direction: 'up' | 'down') => {
    const currentIndex = params().entries.findIndex(entry => entry.uuid === state.params.entry_uuid);

    const offset = direction === 'up' ? -1 : 1;
    const entry = params().entries[currentIndex + offset];
    if (!entry) return;

    const activeItem = findEntryItem(entry.uuid);
    if (activeItem) activeItem.focus();

    // Cancel the current entry view request
    queryClient.cancelQueries({ queryKey: [QUERY_KEYS.ENTRIES_VIEW, state.params.entry_uuid] });

    navigate(state.getEntryUrl(entry.uuid));
  }, 30);
};
