import { Switch, Match, For, Component, createEffect, createSignal } from 'solid-js';
import { useInfiniteEntries } from '~/hooks/queries/use-infinite-entries';
import { Spinner } from '../ui/spinner';
import { type NullableBounds, createElementBounds } from '@solid-primitives/bounds';
import { EntryItem } from './entry-item';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { Empty } from '../ui/empty';

type EntryListProps = {
  containerBounds?: Readonly<NullableBounds>;
};

export const EntryList: Component<EntryListProps> = props => {
  const [bottomOfList, setBottomOfList] = createSignal<HTMLElement>();
  const listBounds = createElementBounds(bottomOfList);

  const { feeds } = useFeeds();
  const entries = useInfiniteEntries();

  createEffect(() => {
    const bottomOfListVisible =
      props.containerBounds?.bottom && listBounds.bottom && listBounds.bottom <= props.containerBounds?.bottom;
    if (!bottomOfListVisible || !entries.query.hasNextPage || entries.query.isFetchingNextPage) return;

    entries.query.fetchNextPage();
  });

  // useListNav(() => ({
  //   entries: entries.data || [],
  //   current_entry_uuid: props.current_entry_uuid,
  //   getUrl,
  // }));

  return (
    <Switch>
      <Match when={entries.query.isError}>
        <p class="px-4">Error: {entries.query.error?.message}</p>
      </Match>

      <Match when={entries.query.isSuccess && feeds.data}>
        {entries.getAllEntries().length ? (
          <div class="-mt-2 flex flex-col gap-1 px-4 pb-2">
            <For each={entries.getAllEntries()}>{entry => <EntryItem entry={entry} />}</For>

            <div ref={setBottomOfList} class="-mt-1" />

            {entries.query.isFetchingNextPage && (
              <div class="flex w-full items-center justify-center p-4">
                <Spinner />
              </div>
            )}
          </div>
        ) : (
          <div class="h-full w-full flex-1 px-4 pb-4">
            <Empty>No entries to display</Empty>
          </div>
        )}
      </Match>
    </Switch>
  );
};
