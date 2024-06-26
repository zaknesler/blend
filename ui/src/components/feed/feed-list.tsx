import { useLocation } from '@solidjs/router';
import { HiOutlineSquare3Stack3d } from 'solid-icons/hi';
import { For, Match, Show, Switch, createSignal } from 'solid-js';
import { useQueryState } from '~/contexts/query-state-context';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';
import { BaseFeedItem, FeedItem } from './feed-item';

export const FeedList = () => {
  const state = useQueryState();
  const location = useLocation();

  const { feeds } = useFeeds();
  const { totalStats } = useFeedsStats();

  const [allFeedsMenuOpen, setAllFeedsMenuOpen] = createSignal(false);

  return (
    <div class="flex w-full flex-col gap-4 p-4 xl:p-0">
      <BaseFeedItem
        href={'/'.concat(state.getQueryString())}
        title="All feeds"
        icon={() => <HiOutlineSquare3Stack3d class="size-6 text-gray-600 md:size-5 dark:text-gray-500" />}
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
            <Show when={feeds.data?.length} fallback={<div>No feeds.</div>}>
              <For each={feeds.data}>{feed => <FeedItem feed={feed} />}</For>
            </Show>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
