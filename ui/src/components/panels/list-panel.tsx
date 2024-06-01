import { createActiveElement } from '@solid-primitives/active-element';
import { createElementBounds } from '@solid-primitives/bounds';
import { useIsRouting } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { Match, Show, Switch, createEffect, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import { EntryList } from '~/components/entry/entry-list';
import { FeedHeader } from '~/components/feed/feed-header';
import { FeedInfo } from '~/components/feed/feed-info';
import { FeedList } from '~/components/feed/feed-list';
import { Panel } from '~/components/layout/panel';
import { MenuFeeds } from '~/components/menus/feeds-menu';
import { NavRow } from '~/components/nav/nav-row';
import { NavViewSwitcher } from '~/components/nav/nav-view-switcher';
import { useQueryState } from '~/contexts/query-state-context';
import { useViewport } from '~/hooks/use-viewport';

export const ListPanel = () => {
  const state = useQueryState();
  const viewport = useViewport();
  const isRouting = useIsRouting();

  const [showFeedSelector, setShowFeedSelector] = createSignal(false);
  const [allFeedsMenuOpen, setAllFeedsMenuOpen] = createSignal(false);

  const [container, setContainer] = createSignal<HTMLElement>();
  const containerBounds = createElementBounds(container);

  const viewingEntry = () => !!state.params.entry_uuid;

  const isMobile = () => viewport.lteBreakpoint('md');
  const showPanel = () => !isMobile() || (isMobile() && !viewingEntry());
  const showFeeds = () => viewport.lteBreakpoint('xl') && showFeedSelector();

  const activeElement = createActiveElement();
  const containsActiveElement = () => container()?.contains(activeElement());

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
          class="-translate-y-[9999px] absolute top-2 left-2 z-[9999] select-none appearance-none rounded-lg border bg-white px-3 py-2 text-black text-sm shadow-lg focus:translate-y-0 focus:border-gray-200 active:bg-gray-100 focus:outline-none focus:ring-2"
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
        <div class="z-10 flex shrink-0 flex-col gap-4 bg-gray-50 p-4 shadow dark:bg-gray-900 dark:shadow-xl">
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
                  <div class="flex w-full select-none items-start justify-between">
                    <FeedHeader title="All feeds" />
                    <MenuFeeds
                      open={allFeedsMenuOpen()}
                      setOpen={setAllFeedsMenuOpen}
                      triggerClass="size-6 rounded-md"
                      triggerIconClass="w-4 h-4 text-gray-500"
                      gutter={4}
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
                <EntryList containerBounds={containerBounds} containsActiveElement={containsActiveElement()} />
              </Match>
            </Switch>
          </div>
        </Show>
      </Panel>
    </>
  );
};
