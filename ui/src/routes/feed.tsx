import { createActiveElement } from '@solid-primitives/active-element';
import { createElementBounds } from '@solid-primitives/bounds';
import { createScrollPosition } from '@solid-primitives/scroll';
import { useIsRouting } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { createEffect, createSignal } from 'solid-js';
import { EntryList } from '~/components/entry/entry-list';
import { EntryPanel } from '~/components/entry/entry-panel';
import { FeedHeader } from '~/components/feed/feed-header';
import { FeedInfo } from '~/components/feed/feed-info';
import { FeedList } from '~/components/feed/feed-list';
import { Panel } from '~/components/layout/panel';
import { Sidebar } from '~/components/layout/sidebar';
import { MenuFeeds } from '~/components/menus/menu-feeds';
import { NavRow } from '~/components/nav/nav-row';
import { NavViewSwitcher } from '~/components/nav/nav-view-switcher';
import { useQueryState } from '~/hooks/use-query-state';
import { useViewport } from '~/hooks/use-viewport';

export default () => {
  const state = useQueryState();
  const isRouting = useIsRouting();
  const { lteBreakpoint } = useViewport();

  const [_showFeeds, setShowFeeds] = createSignal(false);
  const [allFeedsMenuOpen, setAllFeedsMenuOpen] = createSignal(false);

  const [container, setContainer] = createSignal<HTMLElement>();
  const containerBounds = createElementBounds(container);
  const containerScroll = createScrollPosition(container);

  const viewingEntry = () => !!state.params.entry_uuid;

  const isMobile = () => lteBreakpoint('md');
  const showPanel = () => !isMobile() || (isMobile() && !viewingEntry());
  const showFeeds = () => lteBreakpoint('xl') && _showFeeds();

  const activeElement = createActiveElement();
  const containsActiveElement = () => container()?.contains(activeElement());

  const handleSkipToContent = () => {
    const el = container();
    if (!el) return;

    const focusable = el.querySelector('[tabindex="0"]') as HTMLElement | undefined;
    focusable?.focus() || el.focus();
  };

  createEffect(() => {
    if (!isRouting()) return;
    setShowFeeds(false);
  });

  createEffect(() => {
    // Scroll to top of list whenever the feed URL changes
    state.getFeedUrl();
    container()?.scrollTo({ top: 0, behavior: 'instant' });
  });

  return (
    <>
      <button
        type="button"
        class="-translate-y-[9999px] absolute top-2 left-2 z-[9999] select-none appearance-none rounded-lg border bg-white px-3 py-2 text-black text-sm shadow-lg focus:translate-y-0 focus:border-gray-200 active:bg-gray-100 focus:outline-none focus:ring-2"
        tabindex={1}
        onClick={handleSkipToContent}
      >
        Skip to content
      </button>

      <Sidebar class="hidden xl:flex xl:w-sidebar xl:shrink-0" />

      <div class="flex h-full w-full flex-1 flex-col overflow-hidden">
        <div class="flex flex-1 flex-col overflow-auto md:flex-row md:gap-4 md:p-4">
          <Panel
            class={cx(
              'flex shrink-0 flex-col lg:max-w-xs md:max-w-[16rem] xl:max-w-md',
              showPanel() ? 'flex-1' : 'z-10 flex-none shadow dark:shadow-xl',
            )}
            ref={setContainer}
          >
            <div
              class={cx(
                'sticky top-0 flex flex-col gap-4 bg-white/25 p-4 backdrop-blur-md dark:bg-gray-900/25',
                !showPanel() && 'pb-0',
                showFeeds() && 'mb-4 pb-0',
                showPanel() && containerScroll.y > 0 && 'z-10 shadow dark:shadow-xl',
              )}
            >
              <div class="-m-4 mb-0 xl:hidden">
                <NavRow
                  open={showFeeds()}
                  setOpen={setShowFeeds}
                  showFeedSwitch={(!viewingEntry() && isMobile()) || !isMobile()}
                  showBackArrow={viewingEntry() && isMobile()}
                />
              </div>

              {showPanel() && !showFeeds() && (
                <>
                  <div class="flex justify-between">
                    {state.params.feed_uuid ? (
                      <FeedInfo uuid={state.params.feed_uuid!} />
                    ) : (
                      <div class="flex w-full items-start justify-between">
                        <FeedHeader title="All feeds" />
                        <MenuFeeds
                          open={allFeedsMenuOpen()}
                          setOpen={setAllFeedsMenuOpen}
                          triggerClass="h-6 w-6 rounded-md"
                          triggerIconClass="w-4 h-4 text-gray-500"
                          gutter={4}
                        />
                      </div>
                    )}
                  </div>

                  <NavViewSwitcher />
                </>
              )}
            </div>

            {showPanel() && (
              <div class={cx('flex-1', containerScroll.y > 0 ? 'z-auto' : 'z-10')}>
                {showFeeds() ? (
                  <div class="flex w-full flex-col items-stretch gap-1 px-4">
                    <FeedList />
                  </div>
                ) : (
                  <EntryList containerBounds={containerBounds} containsActiveElement={containsActiveElement()} />
                )}
              </div>
            )}
          </Panel>

          <EntryPanel />
        </div>
      </div>
    </>
  );
};
