import { useParams, useSearchParams } from '@solidjs/router';
import { createContext, useContext } from 'solid-js';
import { type FilterEntriesParams, SortDirection, View } from '~/types/bindings';

type QueryStateContext = ReturnType<typeof makeQueryStateContext>;
export const QueryStateContext = createContext<QueryStateContext>();

export const useQueryState = () => {
  const state = useContext(QueryStateContext);
  if (!state) throw new Error('QueryStateContext has not been initialized.');
  return state;
};

type RouterParams = {
  entry_uuid?: string;
  feed_uuid?: string;
  folder_slug?: string;
};

type QueryParams = Partial<Pick<FilterEntriesParams, 'view' | 'sort'>>;

export const DEFAULT_VIEW = View.Unread;
export const DEFAULT_DIRECTION = SortDirection.Newest;

export const makeQueryStateContext = () => {
  const params = useParams<RouterParams>();
  const [query, setQuery] = useSearchParams<QueryParams>();

  const getView = () => query.view || DEFAULT_VIEW;
  const setView = (value?: View) => {
    const view = value === DEFAULT_VIEW ? undefined : value;
    setQuery({ view });
  };

  const getSort = () => query.sort || DEFAULT_DIRECTION;
  const setSort = (value?: SortDirection) => {
    const sort = value === DEFAULT_DIRECTION ? undefined : value;
    setQuery({ sort });
  };

  const getQueryString = () => {
    const entries = [
      ['view', query.view || ''],
      ['sort', query.sort || ''],
    ] as [keyof QueryParams, string][];

    // Since we fallback to default values, remove any empty query params to get the cleanest URL we can
    const filtered = entries.filter(([, value]) => Boolean(value));
    if (!filtered.length) return '';

    const builder = new URLSearchParams(Object.fromEntries(filtered));
    return `?${builder.toString()}`;
  };

  const getBasePath = () => {
    if (params.folder_slug) `/folder/${params.folder_slug}`;
    if (params.feed_uuid) `/feeds/${params.feed_uuid}`;
    return '/';
  };

  const getFeedUrl = (append?: string, withQuery = true) => {
    const path = getBasePath();
    const withAppended = append ? path.concat(append) : path;
    const trimmed = withAppended.replace(/\/\//g, '/');
    return withQuery ? trimmed.concat(getQueryString()) : trimmed;
  };

  const getEntryUrl = (entry_uuid: string, withQuery = true) => getFeedUrl(`/entries/${entry_uuid}`, withQuery);

  return {
    params,
    query,
    setQuery,
    getView,
    setView,
    getSort,
    setSort,
    getQueryString,
    getFeedUrl,
    getEntryUrl,
  };
};
