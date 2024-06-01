import { type NullableBounds, createElementBounds } from '@solid-primitives/bounds';
import { type Component, For, Match, Show, Switch, createEffect, createSignal } from 'solid-js';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { useInfiniteEntries } from '~/hooks/queries/use-infinite-entries';
import { useListNav } from '~/hooks/use-list-nav';
import { Empty } from '../ui/empty';
import { Spinner } from '../ui/spinner';
import { EntryItem } from './entry-item';

type EntryListProps = {
  containerBounds?: Readonly<NullableBounds>;
  containsActiveElement?: boolean;
};

export const EntryList: Component<EntryListProps> = props => {
  const [bottomOfList, setBottomOfList] = createSignal<HTMLElement>();
  const listBounds = createElementBounds(bottomOfList);

  const { feeds } = useFeeds();
  const entries = useInfiniteEntries();

  // Handle arrow navigation
  useListNav(() => ({
    enabled: !!props.containsActiveElement,
    entries: entries.getAllEntries(),
  }));

  createEffect(() => {
    if (!listBounds.bottom || !props.containerBounds?.bottom) return;

    const bottomOfListVisible = listBounds.bottom * 0.9 <= props.containerBounds.bottom;
    if (!bottomOfListVisible) return;

    entries.fetchMore();
  });

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
        <Show
          when={entries.getAllEntries().length}
          fallback={
            <div class="h-full w-full flex-1 px-4 pb-4">
              <Empty>No entries to display.</Empty>
            </div>
          }
        >
          <div class="-mt-2 flex flex-col gap-2 px-4 pb-2">
            <For each={entries.getAllEntries()}>
              {(entry, index) => (
                <EntryItem
                  tabIndex={index() === 0 ? 0 : -1} // Disable tabindex so we can override it with arrow keys
                  entry={entry}
                />
              )}
            </For>

            <div ref={setBottomOfList} class="-mt-1" />

            <Show when={entries.query.isFetchingNextPage}>
              <div class="flex w-full items-center justify-center p-4">
                <Spinner />
              </div>
            </Show>
          </div>
        </Show>
      </Match>
    </Switch>
  );
};
