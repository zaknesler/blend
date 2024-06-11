import { useParams, useSearchParams } from '@solidjs/router';
import { createContext, useContext } from 'solid-js';
import { type FilterEntriesParams, SortDirection, View } from '~/types/bindings';
import { formatQueryString } from '~/utils/query';

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

export const DEFAULTS: Required<QueryParams> = {
  view: View.Unread,
  sort: SortDirection.Newest,
};

export const makeQueryStateContext = () => {
  const params = useParams<RouterParams>();
  const [query, setQuery] = useSearchParams<QueryParams>();

  const getView = () => query.view || DEFAULTS.view;
  const setView = (value?: View) => {
    const view = value === DEFAULTS.view ? undefined : value;
    setQuery({ view });
  };

  const getSort = () => query.sort || DEFAULTS.sort;
  const setSort = (value?: SortDirection) => {
    const sort = value === DEFAULTS.sort ? undefined : value;
    setQuery({ sort });
  };

  const getQueryString = () => formatQueryString(query);

  const getBasePath = () => {
    if (params.folder_slug) return `/folder/${params.folder_slug}`;
    if (params.feed_uuid) return `/feeds/${params.feed_uuid}`;
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
