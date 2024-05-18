import { DEFAULT_DIRECTION } from '~/hooks/use-filter-params';
import { Entry, FilterDirection } from '~/types/bindings';

/**
 * Get the function to compare two entries for sorting.
 */
export const getEntryComparator =
  (dir = DEFAULT_DIRECTION) =>
  (a: Entry, b: Entry) => {
    // If any entry does not have a date, push it to the end
    if (!a.published_at || !b.published_at) return -1;

    switch (dir) {
      case FilterDirection.Desc:
        return new Date(b.published_at).valueOf() - new Date(a.published_at).valueOf();
      case FilterDirection.Asc:
        return new Date(a.published_at).valueOf() - new Date(b.published_at).valueOf();
    }
  };
