import { DATA_ATTRIBUTES } from '~/constants/attributes';
import { DEFAULT_DIRECTION } from '~/contexts/query-state-context';
import { type Entry, SortDirection } from '~/types/bindings';

/**
 * Get the function to compare two entries for sorting.
 */
export const getEntryComparator =
  (sort = DEFAULT_DIRECTION) =>
  (a: Entry, b: Entry) => {
    const dateA = a.published_at || a.updated_at;
    const dateB = b.published_at || b.updated_at;

    // If we have no dates for comparison, push the item to the end of the list
    if (!dateA || !dateB) return -1;

    switch (sort) {
      case SortDirection.Newest:
        return new Date(dateB).valueOf() - new Date(dateA).valueOf();
      case SortDirection.Oldest:
        return new Date(dateA).valueOf() - new Date(dateB).valueOf();
    }
  };

export const findEntryItem = (uuid?: string) => {
  if (!uuid) return null;

  const activeItem = document.querySelector(`[${DATA_ATTRIBUTES.ENTRY_ITEM_UUID}="${uuid}"]`);
  if (!(activeItem instanceof HTMLElement)) return null;

  return activeItem;
};
