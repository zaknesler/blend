import { createActiveElement } from '@solid-primitives/active-element';
import { createContext, useContext } from 'solid-js';
import { IDS } from '~/constants/elements';
import { useInfiniteEntries } from '~/hooks/queries/use-infinite-entries';
import { useListNav } from '~/hooks/use-list-nav';

type EntriesContext = ReturnType<typeof makeEntriesContext>;
export const EntriesContext = createContext<EntriesContext>();

export const useEntries = () => {
  const state = useContext(EntriesContext);
  if (!state) throw new Error('EntriesContext has not been initialized.');
  return state;
};

export const makeEntriesContext = () => {
  const data = useInfiniteEntries();

  // If the user is focused within the entry content, don't respond to arrow keys
  const activeElement = createActiveElement();
  const isFocusedWithinEntry = () => !!document.getElementById(IDS.ARTICLE)?.contains(activeElement());

  // Handle arrow navigation
  const nav = useListNav(() => ({
    enabled: !isFocusedWithinEntry(),
    entryUuids: data.allEntries().map(entry => entry.uuid),
    fetchMore: data.fetchMore,
  }));

  return {
    data,
    nav,
  };
};
