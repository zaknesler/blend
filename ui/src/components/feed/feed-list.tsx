import { For, Match, Show, Switch } from 'solid-js';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { FeedFolder } from './feed-folder';
import { AllFeedsItem, FeedItem } from './feed-item';

export const FeedList = () => {
  const feeds = useFeeds();

  return (
    <div class="flex w-full flex-col gap-4 px-3 py-4 xl:p-0">
      <AllFeedsItem />

      <div class="flex w-full flex-col gap-1">
        <h3 class="mx-1 select-none font-semibold text-gray-500 text-xs uppercase tracking-wider dark:text-gray-400">
          Feeds
        </h3>

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
