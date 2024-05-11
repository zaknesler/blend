import { Panel } from '~/components/layout/panel';
import { EntryList } from '~/components/entry/entry-list';
import { FeedInfo } from '~/components/feed/feed-info';
import { FeedHeader } from '~/components/feed/feed-header';
import { createSignal } from 'solid-js';
import { createElementBounds } from '@solid-primitives/bounds';
import { useFilterParams } from '~/hooks/use-filter-params';
import { cx } from 'class-variance-authority';
import { createScrollPosition } from '@solid-primitives/scroll';
import { NavViewSwitcher } from './nav-view-switcher';

export const NavPanel = () => {
  const filter = useFilterParams();

  const [container, setContainer] = createSignal<HTMLElement>();
  const containerBounds = createElementBounds(container);
  const containerScroll = createScrollPosition(container);

  const viewingEntry = () => !!filter.params.entry_uuid;

  return (
    <Panel
      class={cx(
        'shrink-0 flex-col md:max-w-[16rem] lg:max-w-xs xl:max-w-md',
        viewingEntry() ? 'hidden md:flex' : 'flex',
      )}
      ref={setContainer}
    >
      <div
        class={cx(
          'sticky top-0 flex flex-col gap-2 bg-white/25 p-4 backdrop-blur-md dark:bg-gray-900/25',
          containerScroll.y > 0 && 'z-10 shadow dark:shadow-xl',
        )}
      >
        <div class="flex justify-between">
          {filter.params.feed_uuid ? <FeedInfo uuid={filter.params.feed_uuid!} /> : <FeedHeader title="All feeds" />}
        </div>

        <NavViewSwitcher />
      </div>

      <div class={cx('flex-1', containerScroll.y > 0 ? 'z-auto' : 'z-10')}>
        <EntryList containerBounds={containerBounds} />
      </div>
    </Panel>
  );
};
