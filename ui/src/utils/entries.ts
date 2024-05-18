import { DEFAULT_DIRECTION } from '~/hooks/use-filter-params';
import { Entry, FilterDirection } from '~/types/bindings';

/**
 * Get the function to compare two entries for sorting.
 */
export const getEntryComparator =
  (dir = DEFAULT_DIRECTION) =>
  (a: Entry, b: Entry) => {
    const dateA = a.published_at || a.updated_at;
    const dateB = b.published_at || b.updated_at;

    // If we have no dates for comparison, push the item to the end of the list
    if (!dateA || !dateB) return -1;

    switch (dir) {
      case FilterDirection.Desc:
        return new Date(dateB).valueOf() - new Date(dateA).valueOf();
      case FilterDirection.Asc:
        return new Date(dateA).valueOf() - new Date(dateB).valueOf();
    }
  };
