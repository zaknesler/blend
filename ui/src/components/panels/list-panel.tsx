import { createElementBounds } from '@solid-primitives/bounds';
import { useIsRouting } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiOutlineArrowPath } from 'solid-icons/hi';
import { Match, Show, Switch, createEffect, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import { EntryList } from '~/components/entry/entry-list';
import { FeedHeader } from '~/components/feed/feed-header';
import { FeedInfo } from '~/components/feed/feed-info';
import { FeedList } from '~/components/feed/feed-list';
import { NavRow } from '~/components/nav/nav-row';
import { NavViewSwitcher } from '~/components/nav/nav-view-switcher';
import { Panel } from '~/components/ui/layout/panel';
import { useQueryState } from '~/contexts/query-state-context';
import { useRefreshFeeds } from '~/hooks/queries/use-refresh-feeds';
import { useViewport } from '~/hooks/use-viewport';
import { IconButton } from '../ui/button/icon-button';

export const ListPanel = () => {
  const state = useQueryState();
  const viewport = useViewport();
  const isRouting = useIsRouting();

  const refresh = useRefreshFeeds();

  const [showFeedSelector, setShowFeedSelector] = createSignal(false);

  const [container, setContainer] = createSignal<HTMLElement>();
  const containerBounds = createElementBounds(container);

  const viewingEntry = () => !!state.params.entry_uuid;

  const isMobile = () => viewport.lteBreakpoint('md');
  const showPanel = () => !isMobile() || (isMobile() && !viewingEntry());
  const showFeeds = () => viewport.lteBreakpoint('xl') && showFeedSelector();

  const handleSkipToContent = () => {
    const el = container();
    if (!el) return;

    const focusable = el.querySelector('[tabindex="0"]') as HTMLElement | undefined;
    focusable?.focus() || el.focus();
  };

  createEffect(() => {
    // Hide feed selector when routing
    if (!isRouting()) return;
    setShowFeedSelector(false);
  });

  createEffect(() => {
    // Scroll to top of list whenever the feed URL changes
    state.getFeedUrl();

    container()?.scrollTo({ top: 0, behavior: 'instant' });
  });

  return (
    <>
      <Portal>
        <button
          type="button"
          class="-translate-y-[9999px] absolute top-2 left-2 z-[9999] select-none appearance-none rounded-lg border bg-white px-3 py-2 text-black text-sm shadow-lg focus:translate-y-0 dark:focus:border-gray-400 focus:border-gray-200 active:bg-gray-100 dark:bg-gray-950 dark:text-gray-300 focus:outline-none dark:focus:ring-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-30"
          tabindex={1}
          onClick={handleSkipToContent}
        >
          Skip to content
        </button>
      </Portal>

      <Panel
        class={cx(
          'z-10 flex shrink-0 flex-col lg:max-w-xs md:max-w-[16rem] xl:max-w-md',
          showPanel() ? 'flex-1 overflow-hidden' : 'flex-none shadow dark:shadow-xl',
        )}
      >
        <div class="z-10 flex shrink-0 flex-col gap-4 bg-gray-50 p-4 shadow dark:bg-gray-950 md:dark:bg-gray-900 dark:shadow-xl">
          <div class="-m-4 xl:hidden">
            <NavRow
              open={showFeeds()}
              setOpen={setShowFeedSelector}
              showFeedSwitch={(!viewingEntry() && isMobile()) || !isMobile()}
              showBackArrow={viewingEntry() && isMobile()}
            />
          </div>

          <Show when={showPanel() && !showFeeds()}>
            <NavViewSwitcher />

            <div class="flex justify-between">
              <Switch>
                {/* Showing single feed -- show feed info */}
                <Match when={state.params.feed_uuid}>
                  <FeedInfo uuid={state.params.feed_uuid!} />
                </Match>

                {/* Showing all feeds -- create custom label */}
                <Match when={!state.params.feed_uuid}>
                  <div class="flex w-full select-none items-start justify-between gap-2">
                    <FeedHeader title="All feeds" />

                    <IconButton
                      onClick={() => refresh.refreshFeeds()}
                      icon={HiOutlineArrowPath}
                      tooltip="Refresh all feeds"
                      class="z-10 size-6 rounded-md text-gray-500"
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
