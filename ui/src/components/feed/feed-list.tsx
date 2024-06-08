import { useLocation } from '@solidjs/router';
import { HiOutlineSquare3Stack3d } from 'solid-icons/hi';
import { For, Match, Show, Switch } from 'solid-js';
import { useQueryState } from '~/contexts/query-state-context';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';
import { FeedFolder } from './feed-folder';
import { BaseFeedItem, FeedItem } from './feed-item';

export const FeedList = () => {
  const state = useQueryState();
  const location = useLocation();

  const feeds = useFeeds();
  const stats = useFeedsStats();

  return (
    <div class="flex w-full flex-col gap-4 p-4 xl:p-0">
      <BaseFeedItem
        href={'/'.concat(state.getQueryString())}
        title="All feeds"
        icon={() => <HiOutlineSquare3Stack3d class="size-6 text-gray-600 md:size-5 dark:text-gray-500" />}
        active={location.pathname === '/'}
        unread_count={stats.total()?.count_unread}
      />

      <div class="flex w-full flex-col gap-1">
        <h3 class="select-none font-semibold text-gray-500 text-xs uppercase tracking-wider dark:text-gray-400">
          Feeds
        </h3>

        <FeedFolder slug="photography" label="Photography">
          <Switch>
            <Match when={feeds.query.isError}>
              <p>Error: {feeds.query.error?.message}</p>
            </Match>

            <Match when={feeds.query.isSuccess}>
              <Show when={feeds.query.data?.length} fallback={<div>No feeds.</div>}>
                <For each={feeds.query.data}>{feed => <FeedItem feed={feed} />}</For>
              </Show>
            </Match>
          </Switch>
        </FeedFolder>
      </div>
    </div>
  );
};
