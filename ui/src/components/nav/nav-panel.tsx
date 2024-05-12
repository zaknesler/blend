import { Panel } from '~/components/layout/panel';
import { EntryList } from '~/components/entry/entry-list';
import { FeedInfo } from '~/components/feed/feed-info';
import { FeedHeader } from '~/components/feed/feed-header';
import { createEffect, createSignal } from 'solid-js';
import { createElementBounds } from '@solid-primitives/bounds';
import { useFilterParams } from '~/hooks/use-filter-params';
import { cx } from 'class-variance-authority';
import { createScrollPosition } from '@solid-primitives/scroll';
import { NavViewSwitcher } from './nav-view-switcher';
import { useIsRouting } from '@solidjs/router';
import { FeedList } from '../feed/feed-list';
import { NavRow } from './nav-row';
import { createWindowSize } from '@solid-primitives/resize-observer';
import { fullConfig } from '~/utils/tw';

const mobileBreakpoint = +fullConfig.theme.maxWidth['screen-md'].replace('px', '');

export const NavPanel = () => {
  const filter = useFilterParams();
  const isRouting = useIsRouting();
  const size = createWindowSize();

  const [showFeeds, setShowFeeds] = createSignal(false);

  createEffect(() => {
    if (!isRouting()) return;
    setShowFeeds(false);
  });

  const [container, setContainer] = createSignal<HTMLElement>();
  const containerBounds = createElementBounds(container);
  const containerScroll = createScrollPosition(container);

  const viewingEntry = () => !!filter.params.entry_uuid;

  const isMobile = () => size.width <= mobileBreakpoint;
  const showPanel = () => !isMobile() || (isMobile() && !viewingEntry());

  return (
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
                <FeedHeader title="All feeds" />
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
  );
};
