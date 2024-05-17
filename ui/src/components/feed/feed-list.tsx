import { For, Match, Switch, createSignal } from 'solid-js';
import { Skeleton } from '../ui/skeleton';
import { BaseFeedItem, FeedItem } from './feed-item';
import { useFilterParams } from '~/hooks/use-filter-params';
import { useLocation } from '@solidjs/router';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { useFeedsStats } from '~/hooks/queries/use-feeds-stats';
import { AllFeedsMenu } from './feed-menu';

export const FeedList = () => {
  const location = useLocation();
  const filter = useFilterParams();

  const [allFeedsMenuOpen, setAllFeedsMenuOpen] = createSignal(false);

  const { feeds } = useFeeds();
  const { totalStats } = useFeedsStats();

  return (
    <Switch>
      <Match when={feeds.isPending}>
        <div class="flex flex-col gap-2">
          <Skeleton class="h-8" color="light" />
          <Skeleton class="h-8" color="light" />
          <Skeleton class="h-8" color="light" />
          <Skeleton class="h-8" color="light" />
          <Skeleton class="h-8" color="light" />
        </div>
      </Match>

      <Match when={feeds.isError}>
        <p>Error: {feeds.error?.message}</p>
      </Match>

      <Match when={feeds.isSuccess}>
        {feeds.data?.length ? (
          <>
            <BaseFeedItem
              href={'/'.concat(filter.getQueryString())}
              title="All feeds"
              open={allFeedsMenuOpen() || location.pathname === '/'}
              setOpen={setAllFeedsMenuOpen}
              unread_count={totalStats()?.count_unread}
              menu={() => (
                <AllFeedsMenu
                  open={allFeedsMenuOpen()}
                  setOpen={setAllFeedsMenuOpen}
                  gutter={4}
                  triggerClass="h-5 w-5 rounded"
                  triggerIconClass="w-4 h-4 text-gray-500"
                />
              )}
            />
            <For each={feeds.data}>{feed => <FeedItem feed={feed} />}</For>
          </>
        ) : (
          <div>No feeds.</div>
        )}
      </Match>
    </Switch>
  );
};
