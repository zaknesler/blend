import { createElementBounds } from '@solid-primitives/bounds';
import { useBeforeLeave } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiOutlineArrowPath, HiOutlineCheck } from 'solid-icons/hi';
import { Match, Show, Switch, createEffect, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import { EntryList } from '~/components/entry/entry-list';
import { FeedHeader } from '~/components/feed/feed-header';
import { FeedInfo } from '~/components/feed/feed-info';
import { FeedList } from '~/components/feed/feed-list';
import { NavRow } from '~/components/nav/nav-row';
import { NavViewTabs } from '~/components/nav/nav-view-tabs';
import { Panel } from '~/components/ui/layout/panel';
import { useNotifications } from '~/contexts/notification-context';
import { useQueryState } from '~/contexts/query-state-context';
import { useViewport } from '~/contexts/viewport-context';
import { useRefreshFeeds } from '~/hooks/queries/use-refresh-feeds';
import { IconButton } from '../ui/button/icon-button';

export const ListPanel = () => {
  const state = useQueryState();
  const viewport = useViewport();

  const refreshFeeds = useRefreshFeeds();
  const notifications = useNotifications();

  const [showFeedSelector, setShowFeedSelector] = createSignal(viewport.lte('xl'));

  const [container, setContainer] = createSignal<HTMLElement>();
  const containerBounds = createElementBounds(container);

  const viewingEntry = () => !!state.params.entry_uuid;

  const isMobile = () => viewport.lte('md');
  const showPanel = () => !isMobile() || (isMobile() && !viewingEntry());
  const showFeeds = () => viewport.lte('xl') && showFeedSelector();

  const handleSkipToContent = () => {
    const el = container();
    if (!el) return;

    const focusable = el.querySelector('[tabindex="0"]') as HTMLElement | undefined;
    focusable?.focus() || el.focus();
  };

  // Close the feed selector when routing (i.e. we've clicked a feed link)
  useBeforeLeave(e => {
    // Don't reset if we're just opening a folder
    if (e.to?.toString().startsWith('/folder')) return;

    setShowFeedSelector(false);
  });

  // Scroll to top of list whenever the feed URL changes
  createEffect(() => {
    state.getFeedUrl();
    container()?.scrollTo({ top: 0, behavior: 'instant' });
  });

  return (
    <>
      <Portal>
        <button
          type="button"
          class="-translate-y-[9999px] absolute top-2 left-2 z-[9999] hidden select-none appearance-none rounded-lg border bg-white px-3 py-2 text-black text-sm shadow-lg focus-visible:translate-y-0 focus-visible:border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-opacity-30 active:bg-gray-100 md:flex dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:border-gray-400 dark:focus-visible:ring-gray-600"
          tabindex={1}
          onClick={handleSkipToContent}
        >
          Skip to content
        </button>
      </Portal>

      <Panel
        class={cx(
          'z-10 flex shrink-0 flex-col md:max-w-[16rem] lg:max-w-xs xl:max-w-md',
          showPanel() ? 'flex-1 overflow-hidden' : 'flex-none shadow dark:shadow-xl',
        )}
      >
        <div
          class={cx(
            'z-10 flex shrink-0 flex-col gap-4 bg-gray-50 p-4 dark:bg-gray-950 md:dark:bg-gray-900',
            showPanel() && 'shadow dark:shadow-xl',
          )}
        >
          <div class="-m-4 xl:hidden">
            <NavRow
              open={showFeeds()}
              setOpen={setShowFeedSelector}
              showFeedSwitch={(!viewingEntry() && isMobile()) || !isMobile()}
              showCloseButton={viewingEntry() && isMobile()}
            />
          </div>

          <Show when={showPanel() && !showFeeds()}>
            <NavViewTabs />

            <div class="flex justify-between">
              <Switch>
                {/* Showing single feed -- show feed info */}
                <Match when={state.params.feed_uuid}>
                  <FeedInfo uuid={state.params.feed_uuid!} />
                </Match>

                {/* Showing single folder -- show folder info */}
                <Match when={state.params.folder_slug}>
                  <div class="flex w-full select-none items-start justify-between gap-2">
                    <FeedHeader title="Folder name" />

                    <IconButton
                      disabled
                      icon={HiOutlineCheck}
                      tooltip="Mark all as read"
                      class="z-10 size-8 rounded-lg text-gray-500 md:size-6 md:rounded-md"
                      iconClass="size-5 md:size-4"
                    />

                    <IconButton
                      onSelect={() => refreshFeeds()}
                      icon={HiOutlineArrowPath}
                      tooltip="Refresh all feeds"
                      class="z-10 size-8 rounded-lg text-gray-500 md:size-6 md:rounded-md"
                      iconClass={cx('size-5 md:size-4', !!notifications.feedsRefreshing().length && 'animate-spin')}
                    />
                  </div>
                </Match>

                {/* Showing all feeds -- create custom label */}
                <Match when={!state.params.feed_uuid}>
                  <div class="flex w-full select-none items-start justify-between gap-2">
                    <FeedHeader title="All feeds" />

                    <IconButton
                      disabled
                      icon={HiOutlineCheck}
                      tooltip="Mark all as read"
                      class="z-10 size-8 rounded-lg text-gray-500 md:size-6 md:rounded-md"
                      iconClass="size-5 md:size-4"
                    />

                    <IconButton
                      onSelect={() => refreshFeeds()}
                      icon={HiOutlineArrowPath}
                      tooltip="Refresh all feeds"
                      class="z-10 size-8 rounded-lg text-gray-500 md:size-6 md:rounded-md"
                      iconClass={cx('size-5 md:size-4', !!notifications.feedsRefreshing().length && 'animate-spin')}
                    />
                  </div>
                </Match>
              </Switch>
            </div>
          </Show>
        </div>

        <Show when={showPanel()}>
          <div ref={setContainer} class="flex-1 overflow-auto pt-0.5">
            <Switch>
              <Match when={showFeeds()}>
                <FeedList />
              </Match>

              <Match when={!showFeeds()}>
                <EntryList containerBounds={containerBounds} />
              </Match>
            </Switch>
          </div>
        </Show>
      </Panel>
    </>
  );
};
