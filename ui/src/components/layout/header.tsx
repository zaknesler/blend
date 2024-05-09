import { createEffect, createSignal, type Component } from 'solid-js';
import { Logo } from './logo';
import { cx } from 'class-variance-authority';
import { HiSolidBars2, HiSolidXMark } from 'solid-icons/hi';
import { FeedList } from '../feed/feed-list';
import { Button } from '@kobalte/core/button';
import { Dynamic, Portal } from 'solid-js/web';
import { useIsRouting } from '@solidjs/router';
import { Link } from '../ui/link';
import { useFilterParams } from '~/hooks/use-filter-params';

type HeaderProps = {
  class?: string;
};

export const Header: Component<HeaderProps> = props => {
  const filter = useFilterParams();
  const isRouting = useIsRouting();

  const [navOpen, setNavOpen] = createSignal(false);

  createEffect(() => {
    if (!isRouting()) return;

    setNavOpen(false);
  });

  return (
    <div
      class={cx(
        'flex h-16 flex-col justify-center gap-4 bg-gray-200/20 p-4 shadow-md backdrop-blur-md md:bg-white dark:bg-gray-900',
        props.class,
      )}
    >
      <div class="flex items-center gap-4">
        <div class="flex flex-1 items-center gap-4">
          <Logo />
          {!!filter.params.entry_uuid && (
            <Link href={filter.getFeedUrl()} class="text-sm">
              &larr; Back
            </Link>
          )}
        </div>

        <Button onClick={() => setNavOpen(val => !val)}>
          <Dynamic component={navOpen() ? HiSolidXMark : HiSolidBars2} class="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      {navOpen() && (
        <Portal>
          <div class="absolute top-16 z-10 h-full w-full overflow-y-auto bg-gray-200/20 p-4 shadow backdrop-blur-lg">
            <div class="mx-auto flex w-full max-w-md flex-col gap-1">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Feeds</h3>
              <FeedList />
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};
