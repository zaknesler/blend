import { Button } from '@kobalte/core/button';
import { HiSolidPlusSmall } from 'solid-icons/hi';
import { For, Match, Show, Switch } from 'solid-js';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { setModalStore } from '~/stores/modal';
import { FeedFolder } from './feed-folder';
import { AllFeedsItem, FeedItem } from './feed-item';

export const FeedList = () => {
  const feeds = useFeeds();

  const handleOpenNewFolder = () => {
    setModalStore('createFolder', true);
  };

  return (
    <div class="flex h-full w-full flex-col gap-4 px-3 py-4 xl:p-0">
      <AllFeedsItem />

      <div class="group flex w-full flex-1 flex-col gap-1">
        <div class="mx-1 flex select-none items-baseline justify-between text-gray-500 text-xs dark:text-gray-400">
          <h3 class="font-semibold uppercase tracking-wider">Feeds</h3>
          <Button
            onClick={handleOpenNewFolder}
            class="inline-flex items-center gap-1 opacity-100 transition hover:text-gray-900 hover:underline focus:text-gray-900 focus:opacity-100 group-hover:opacity-100 md:opacity-0 dark:focus:text-gray-100 dark:hover:text-gray-100"
          >
            <HiSolidPlusSmall class="size-3 text-gray-400 dark:text-gray-500" />
            New folder
          </Button>
        </div>

        <Switch>
          <Match when={feeds.query.isError}>
            <p>Error: {feeds.query.error?.message}</p>
          </Match>

          <Match when={feeds.query.isSuccess}>
            <Show when={feeds.query.data?.length} fallback={<div>No feeds.</div>}>
              <FeedFolder slug="photography" label="Photography">
                <For each={feeds.query.data?.slice(0, feeds.query.data.length / 2)}>
                  {feed => <FeedItem feed={feed} />}
                </For>
              </FeedFolder>

              <FeedFolder slug="other" label="Other">
                <For each={feeds.query.data?.slice(feeds.query.data.length / 2)}>
                  {feed => <FeedItem feed={feed} />}
                </For>
              </FeedFolder>
            </Show>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
