import { useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import type { Entry } from '~/types/bindings';
import { useKeyDownEvent } from '@solid-primitives/keyboard';

type UseListNavParams = {
  entries: Entry[];
  current_entry_uuid?: string;
  getUrl: (uuid: string) => string;
};

export const useListNav = (params: () => UseListNavParams) => {
  const keyDownEvent = useKeyDownEvent();
  const navigate = useNavigate();

  createEffect(() => {
    if (!params().entries.length) return;

    const e = keyDownEvent();
    if (!e) return;

    const maybeNavigate = (direction: 'up' | 'down') => {
      e.preventDefault();

      const currentIndex = params().entries.findIndex(entry => entry.uuid === params().current_entry_uuid);
      if (currentIndex === -1) return;

      const offset = direction === 'up' ? -1 : 1;
      const entry = params().entries[currentIndex + offset];
      if (!entry) return;

      console.log('navigate to', entry.uuid);

      navigate(params().getUrl(entry.uuid));
    };

    switch (e.key) {
      case 'ArrowDown':
        maybeNavigate('down');
        break;

      case 'ArrowUp':
        maybeNavigate('up');
        break;
    }
  });
};
