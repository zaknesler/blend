import { DATA_ATTRIBUTES } from '~/constants/attributes';
import { DEFAULT_DIRECTION } from '~/hooks/use-query-state';
import { type Entry, SortDirection } from '~/types/bindings';

/**
 * Get the publish date of an entry, falling back to the updated date.
 */
export const getEntryDate = (entry: Entry) => entry.published_at || entry.updated_at;

/**
 * Get the function to compare two entries for sorting.
 */
export const getEntryComparator =
  (sort = DEFAULT_DIRECTION) =>
  (a: Entry, b: Entry) => {
    const dateA = getEntryDate(a);
    const dateB = getEntryDate(b);

    // If we have no dates for comparison, push the item to the end of the list
    if (!dateA || !dateB) return -1;

    switch (sort) {
      case SortDirection.Newest:
        return new Date(dateB).valueOf() - new Date(dateA).valueOf();
      case SortDirection.Oldest:
        return new Date(dateA).valueOf() - new Date(dateB).valueOf();
    }
  };

/**
 * Find the entry item in the DOM by UUID.
 */
export const findEntryItem = (uuid?: string) => {
  if (!uuid) return null;

  const activeItem = document.querySelector(`[${DATA_ATTRIBUTES.ENTRY_ITEM_UUID}="${uuid}"]`);
  if (!(activeItem instanceof HTMLElement)) return null;

  return activeItem;
};
