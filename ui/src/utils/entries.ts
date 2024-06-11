import { IDS } from '~/constants/elements';
import { DEFAULTS } from '~/contexts/query-state-context';
import { type Entry, SortDirection, View } from '~/types/bindings';

/**
 * Get the function to compare two entries for sorting.
 */
export const getEntryComparator =
  (sort = DEFAULTS.sort) =>
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

  const activeItem = document.getElementById(IDS.ENTRY(uuid));
  if (!(activeItem instanceof HTMLElement)) return null;

  return activeItem;
};

/**
 * Check if the given entry could ever appear in the selected view.
 *
 * e.g. an entry with no `saved_at` date could never appear in the "saved" view.
 */
export const entryMayExistInView = (entry: Entry, view: View) => {
  switch (view) {
    case View.Unread:
      return !entry.read_at;
    case View.Read:
      return !!entry.read_at;
    case View.Saved:
      return !!entry.saved_at;
  }

  return true;
};
