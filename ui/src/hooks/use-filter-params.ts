import { useParams, useSearchParams } from '@solidjs/router';
import { DEFAULT_VIEW, View } from '~/constants/views';

type RouterParams = {
  feed_uuid?: string;
  entry_uuid?: string;
};

type QueryParams = {
  view?: View;
};

export const useFilterParams = () => {
  const params = useParams<RouterParams>();
  const [query, setQuery] = useSearchParams<QueryParams>();

  const getView = () => query.view || DEFAULT_VIEW;
  const setView = (value?: View) => {
    const view = value === DEFAULT_VIEW ? undefined : value;
    setQuery({ view });
  };

  const getQueryString = () => {
    const builder = new URLSearchParams({
      view: query.view || '',
    });

    const hasValues = !![...builder.values()].filter(Boolean).length;
    return hasValues ? `?${builder.toString()}` : '';
  };

  const getEntryUrl = (entry_uuid: string) => {
    const path = params.feed_uuid ? `/feeds/${params.feed_uuid}/entries/${entry_uuid}` : `/entries/${entry_uuid}`;
    return path.concat(getQueryString());
  };

  return {
    params,
    query,
    setQuery,
    getView,
    setView,
    getQueryString,
    getEntryUrl,
  };
};
