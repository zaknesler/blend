import { Switch, Match, For, Component, createEffect, createSignal } from 'solid-js';
import { useInfiniteEntries } from '~/hooks/queries/use-infinite-entries';
import { Spinner } from '../ui/spinner';
import { type NullableBounds, createElementBounds } from '@solid-primitives/bounds';
import { EntryItem } from './entry-item';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { Empty } from '../ui/empty';
import { useFilterParams } from '~/hooks/use-filter-params';
import { getEntryComparator } from '~/utils/entries';

type EntryListProps = {
  containerBounds?: Readonly<NullableBounds>;
};

export const EntryList: Component<EntryListProps> = props => {
  const filter = useFilterParams();

  const [bottomOfList, setBottomOfList] = createSignal<HTMLElement>();
  const listBounds = createElementBounds(bottomOfList);

  const { feeds } = useFeeds();
  const entries = useInfiniteEntries();

  // Maintain local state of entries to prevent entries just marked as read from being removed
  const [localEntries, setLocalEntries] = createSignal(entries.getAllEntries());

  // Associate the local entries with the feed we're viewing, so we know when to reset the data
  const [localFeedKey, setLocalFeedKey] = createSignal(filter.getFeedUrl());

  createEffect(() => {
    const bottomOfListVisible =
      props.containerBounds?.bottom && listBounds.bottom && listBounds.bottom <= props.containerBounds?.bottom;
    if (!bottomOfListVisible) return;

    entries.fetchMore();
  });

  createEffect(() => {
    const currentIds = localEntries().map(entry => entry.id);
    const newEntries = entries.getAllEntries().filter(entry => !currentIds.includes(entry.id));

    // Don't bother updating local state if we've got nothing to add
    if (!newEntries.length) return;

    // Add new entries and sort to maintain order
    setLocalEntries([...localEntries(), ...newEntries].sort(getEntryComparator(filter.getDir())));
  });

  createEffect(() => {
    const feedKey = filter.getFeedUrl();

    // Only reset the local cache if we look at a new feed
    if (localFeedKey() === feedKey) return;

    // Reset the local cache
    setLocalFeedKey(feedKey);
    setLocalEntries(entries.getAllEntries());
  });

  // useListNav(() => ({
  //   entries: entries.data || [],
  //   current_entry_uuid: props.current_entry_uuid,
  //   getUrl,
  // }));

  return (
    <Switch>
      <Match when={entries.query.isPending}>
        <div class="h-full w-full flex-1 px-4 pb-4">
          <Empty>
            <Spinner />
          </Empty>
        </div>
      </Match>

      <Match when={entries.query.isError}>
        <p class="px-4">Error: {entries.query.error?.message}</p>
      </Match>

      <Match when={entries.query.isSuccess && feeds.data}>
        {localEntries().length ? (
          <div class="-mt-2 flex flex-col gap-1 px-4 pb-2">
            <For each={localEntries()}>{entry => <EntryItem entry={entry} />}</For>

            <div ref={setBottomOfList} class="-mt-1" />

            {entries.query.isFetchingNextPage && (
              <div class="flex w-full items-center justify-center p-4">
                <Spinner />
              </div>
            )}
          </div>
        ) : (
          <div class="h-full w-full flex-1 px-4 pb-4">
            <Empty>No entries to display.</Empty>
          </div>
        )}
      </Match>
    </Switch>
  );
};
