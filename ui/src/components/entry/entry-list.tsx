import { createQuery } from '@tanstack/solid-query';
import { Switch, Match, For, Component, createEffect, createSignal } from 'solid-js';
import { QUERY_KEYS } from '~/constants/query';
import { Skeleton } from '../ui/skeleton';
import { getFeeds } from '~/api/feeds';
import { useInfiniteEntries } from '~/hooks/use-infinite-entries';
import { Spinner } from '../ui/spinner';
import { type NullableBounds, createElementBounds } from '@solid-primitives/bounds';
import { EntryItem } from './entry-item';

type EntryListProps = {
  containerBounds?: Readonly<NullableBounds>;
};

export const EntryList: Component<EntryListProps> = props => {
  const [bottomOfList, setBottomOfList] = createSignal<HTMLElement>();
  const listBounds = createElementBounds(bottomOfList);

  const feeds = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS],
    queryFn: getFeeds,
  }));

  const entries = useInfiniteEntries();
  const allEntries = () => entries.data?.pages.flatMap(page => page.data) || [];
  const getFeed = (feed_uuid: string) => feeds.data?.find(feed => feed.uuid === feed_uuid);

  createEffect(() => {
    const bottomOfListVisible =
      props.containerBounds?.bottom && listBounds.bottom && listBounds.bottom <= props.containerBounds?.bottom;
    if (!bottomOfListVisible || !entries.hasNextPage || entries.isFetchingNextPage) return;

    entries.fetchNextPage();
  });

  // useListNav(() => ({
  //   entries: entries.data || [],
  //   current_entry_uuid: props.current_entry_uuid,
  //   getUrl,
  // }));

  return (
    <Switch>
      <Match when={entries.isPending}>
        <div class="flex flex-col gap-2">
          <Skeleton class="h-8" color="muted" />
          <Skeleton class="h-8" color="muted" />
          <Skeleton class="h-8" color="muted" />
          <Skeleton class="h-8" color="muted" />
          <Skeleton class="h-8" color="muted" />
        </div>
      </Match>

      <Match when={entries.isError}>
        <p>Error: {entries.error?.message}</p>
      </Match>

      <Match when={entries.isSuccess && feeds.data}>
        {allEntries().length ? (
          <div class="-mt-2 flex flex-col gap-1 px-4 pb-2">
            <For each={allEntries()}>{entry => <EntryItem entry={entry} feed={getFeed(entry.feed_uuid)!} />}</For>

            <div ref={setBottomOfList} class="-mt-1" />

            {entries.isFetchingNextPage && (
              <div class="flex w-full items-center justify-center p-4">
                <Spinner />
              </div>
            )}
          </div>
        ) : (
          <div class="h-full w-full flex-1 px-4 pb-4">
            <div class="flex h-full w-full items-center justify-center rounded-lg border-4 border-dashed border-gray-200 p-4 py-16 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-300">
              No entries to display
            </div>
          </div>
        )}
      </Match>
    </Switch>
  );
};
