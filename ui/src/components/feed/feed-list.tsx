import { useLocation } from '@solidjs/router';
import { HiOutlineSquare3Stack3d } from 'solid-icons/hi';
import { For, Match, Switch, createSignal } from 'solid-js';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';
import { useQueryState } from '~/hooks/use-query-state';
import { BaseFeedItem, FeedItem } from './feed-item';

export const FeedList = () => {
  const location = useLocation();
  const state = useQueryState();

  const [allFeedsMenuOpen, setAllFeedsMenuOpen] = createSignal(false);

  const { feeds } = useFeeds();
  const { totalStats } = useFeedsStats();

  return (
    <div class="flex w-full flex-col gap-4">
      <BaseFeedItem
        href={'/'.concat(state.getQueryString())}
        title="All feeds"
        icon={() => <HiOutlineSquare3Stack3d class="h-6 w-6 text-gray-600 md:h-5 md:w-5" />}
        open={allFeedsMenuOpen()}
        active={location.pathname === '/'}
        setOpen={setAllFeedsMenuOpen}
        unread_count={totalStats()?.count_unread}
      />

      <div class="flex w-full flex-col gap-1">
        <h3 class="select-none font-semibold text-gray-500 text-xs uppercase tracking-wider dark:text-gray-400">
          Feeds
        </h3>
        <Switch>
          <Match when={feeds.isError}>
            <p>Error: {feeds.error?.message}</p>
          </Match>

          <Match when={feeds.isSuccess}>
            {feeds.data?.length ? (
              <For each={feeds.data}>{feed => <FeedItem feed={feed} />}</For>
            ) : (
              <div>No feeds.</div>
            )}
          </Match>
        </Switch>
      </div>
    </div>
  );
};
