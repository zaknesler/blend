import { useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import type { Entry } from '~/types/bindings';
import { useKeyDownEvent } from '@solid-primitives/keyboard';
import { useFilterParams } from './use-filter-params';
import { debounce } from '@solid-primitives/scheduled';
import { useViewport } from './use-viewport';
import { findEntryItem } from '~/utils/entries';

type UseListNavParams = {
  enabled: boolean;
  entries: Entry[];
};

export const useListNav = (params: () => UseListNavParams) => {
  const filter = useFilterParams();
  const keyDownEvent = useKeyDownEvent();
  const navigate = useNavigate();
  const viewport = useViewport();

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
    const currentIndex = params().entries.findIndex(entry => entry.uuid === filter.params.entry_uuid);

    const offset = direction === 'up' ? -1 : 1;
    const entry = params().entries[currentIndex + offset];
    if (!entry) return;

    const activeItem = findEntryItem(entry.uuid);
    if (activeItem) activeItem.focus();

    navigate(filter.getEntryUrl(entry.uuid));
  }, 30);
};
