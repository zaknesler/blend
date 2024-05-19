import { EntryPanel } from '~/components/entry/entry-panel';
import { Sidebar } from '~/components/layout/sidebar';
import { useFilterParams } from '~/hooks/use-filter-params';
import { Panel } from '~/components/layout/panel';
import { EntryList } from '~/components/entry/entry-list';
import { FeedInfo } from '~/components/feed/feed-info';
import { FeedHeader } from '~/components/feed/feed-header';
import { createEffect, createSignal } from 'solid-js';
import { createElementBounds } from '@solid-primitives/bounds';
import { cx } from 'class-variance-authority';
import { createScrollPosition } from '@solid-primitives/scroll';
import { useIsRouting } from '@solidjs/router';
import { NavViewSwitcher } from '~/components/nav/nav-view-switcher';
import { NavRow } from '~/components/nav/nav-row';
import { FeedList } from '~/components/feed/feed-list';
import { useViewport } from '~/hooks/use-viewport';
import { MenuFeeds } from '~/components/menus/menu-feeds';

export default () => {
  const filter = useFilterParams();
  const isRouting = useIsRouting();
  const { lteBreakpoint } = useViewport();

  const [_showFeeds, setShowFeeds] = createSignal(false);
  const [allFeedsMenuOpen, setAllFeedsMenuOpen] = createSignal(false);

  const [container, setContainer] = createSignal<HTMLElement>();
  const containerBounds = createElementBounds(container);
  const containerScroll = createScrollPosition(container);

  createEffect(() => {
    if (!isRouting()) return;
    setShowFeeds(false);
  });

  createEffect(() => {
    // Scroll to top of list whenever the feed URL changes
    filter.getFeedUrl();
    container()?.scrollTo({ top: 0, behavior: 'instant' });
  });

  const viewingEntry = () => !!filter.params.entry_uuid;

  const isMobile = () => lteBreakpoint('md');
  const showPanel = () => !isMobile() || (isMobile() && !viewingEntry());
  const showFeeds = () => lteBreakpoint('xl') && _showFeeds();

  return (
    <>
      <Sidebar class="hidden xl:flex xl:w-sidebar xl:shrink-0" />

      <div class="flex h-full w-full flex-1 flex-col overflow-hidden">
        <div class="flex flex-1 flex-col overflow-auto md:flex-row md:gap-4 md:p-4">
          <Panel
            class={cx(
              'flex shrink-0 flex-col md:max-w-[16rem] lg:max-w-xs xl:max-w-md',
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
                    {filter.params.feed_uuid ? (
                      <FeedInfo uuid={filter.params.feed_uuid!} />
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
                  <EntryList containerBounds={containerBounds} />
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
