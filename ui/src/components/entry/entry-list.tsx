import { type NullableBounds, createElementBounds } from '@solid-primitives/bounds';
import { HiOutlineInbox } from 'solid-icons/hi';
import { type Component, For, Match, Show, Switch, createEffect, createSignal } from 'solid-js';
import { useEntries } from '~/contexts/entries-context';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { Empty } from '../ui/empty';
import { Spinner } from '../ui/spinner';
import { EntryItem } from './entry-item';

type EntryListProps = {
  containerBounds?: Readonly<NullableBounds>;
};

export const EntryList: Component<EntryListProps> = props => {
  const [bottomOfList, setBottomOfList] = createSignal<HTMLElement>();
  const listBounds = createElementBounds(bottomOfList);

  const feeds = useFeeds();
  const entries = useEntries();

  createEffect(() => {
    if (!listBounds.bottom || !props.containerBounds?.bottom) return;

    const bottomOfListVisible = listBounds.bottom * 0.9 <= props.containerBounds.bottom;
    if (!bottomOfListVisible) return;

    entries.data.fetchMore();
  });

  return (
    <Switch>
      <Match when={entries.data.query.isPending}>
        <div class="size-full flex-1 p-4">
          <Empty>
            <Spinner />
          </Empty>
        </div>
      </Match>

      <Match when={entries.data.query.isError}>
        <p class="p-4">Error: {entries.data.query.error?.message}</p>
      </Match>

      <Match when={entries.data.query.isSuccess && feeds.query.data}>
        <Show
          when={entries.data.allEntries().length}
          fallback={
            <div class="size-full flex-1 p-4">
              <Empty icon={HiOutlineInbox} text="No items to display" />
            </div>
          }
        >
          <div class="flex flex-col gap-2 px-4 py-2">
            <For each={entries.data.allEntries()}>
              {(entry, index) => (
                <EntryItem
                  tabIndex={index() === 0 ? 0 : -1} // Disable tabindex so we can override it with arrow keys
                  entry={entry}
                />
              )}
            </For>

            <div ref={setBottomOfList} class="-mt-1" />

            <Show when={entries.data.query.isFetchingNextPage}>
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
