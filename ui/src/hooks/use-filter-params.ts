import { useParams, useSearchParams } from '@solidjs/router';
import { FilterDirection, FilterEntriesParams, View } from '~/types/bindings';

type RouterParams = {
  feed_uuid?: string;
  entry_uuid?: string;
};

type QueryParams = Partial<Pick<FilterEntriesParams, 'view' | 'dir'>>;

export const DEFAULT_VIEW = View.Unread;
export const DEFAULT_DIRECTION = FilterDirection.Desc;

export const useFilterParams = () => {
  const params = useParams<RouterParams>();
  const [query, setQuery] = useSearchParams<QueryParams>();

  const getView = () => query.view || DEFAULT_VIEW;
  const setView = (value?: View) => {
    const view = value === DEFAULT_VIEW ? undefined : value;
    setQuery({ view });
  };

  const getDir = () => query.dir || DEFAULT_DIRECTION;
  const setDir = (value?: FilterDirection) => {
    const dir = value === DEFAULT_DIRECTION ? undefined : value;
    setQuery({ dir });
  };

  const getQueryString = () => {
    const entries = [
      ['view', query.view || ''],
      ['dir', query.dir || ''],
    ] as [keyof QueryParams, string][];

    // Since we fallback to default values, remove any empty query params to get the cleanest URL we can
    const filtered = entries.filter(([, value]) => Boolean(value));
    if (!filtered.length) return '';

    const builder = new URLSearchParams(Object.fromEntries(filtered));
    return `?${builder.toString()}`;
  };

  const getFeedUrl = (append?: string) => {
    const path = params.feed_uuid ? `/feeds/${params.feed_uuid}` : `/`;
    const withAppended = append ? path.concat(append) : path;
    return withAppended.replace(/\/\//g, '/').concat(getQueryString());
  };

  const getEntryUrl = (entry_uuid: string) => getFeedUrl(`/entries/${entry_uuid}`);

  return {
    params,
    query,
    setQuery,
    getView,
    setView,
    getDir,
    setDir,
    getQueryString,
    getFeedUrl,
    getEntryUrl,
  };
};
