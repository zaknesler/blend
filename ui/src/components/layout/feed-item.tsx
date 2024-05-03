import { A } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiSolidEllipsisHorizontal, HiSolidRss } from 'solid-icons/hi';
import { Component, createSignal } from 'solid-js';
import { Feed } from '~/types/bindings/feed';
import { Popover } from '@kobalte/core/popover';
import { ActionButton, ContextItem } from './action-button';

type FeedItemProps = {
  feed: Feed;
};

export const FeedItem: Component<FeedItemProps> = props => {
  const [open, setOpen] = createSignal(false);
  const [navItemElement, setNavItemElement] = createSignal<HTMLAnchorElement>();

  const handleMenuClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    setOpen(true);
  };

  const handleReturnFocusToNavItem = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    navItemElement()?.focus();
  };

  const handleContextItemClick = (action: string) => {
    alert(action);
  };

  return (
    <A
      href={`/feeds/${props.feed.uuid}`}
      ref={setNavItemElement}
      class={cx(
        'group -mx-1 flex items-center gap-2 rounded-md border p-1 text-sm no-underline outline-none transition',
        'text-gray-600 ring-gray-200',
        'hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900',
        'focus:border-gray-400 focus:ring-2',
        'focus-within:border-gray-300 focus-within:bg-gray-50',
        open() ? 'border-gray-200 bg-gray-50' : 'border-transparent',
      )}
    >
      <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-400">
        <HiSolidRss class="h-4 w-4 text-white" />
      </div>

      <span class="flex-1 overflow-x-hidden truncate">{props.feed.title}</span>

      <Popover open={open()} onOpenChange={setOpen} placement="bottom-end" shift={-6} gutter={8}>
        <Popover.Anchor>
          <Popover.Trigger
            as={() => (
              <ActionButton onClick={handleMenuClick} forceFocus={open()}>
                <HiSolidEllipsisHorizontal class="h-4 w-4 text-gray-700" />
              </ActionButton>
            )}
          />
        </Popover.Anchor>
        <Popover.Portal>
          <Popover.Content
            class="z-50 w-24 origin-[--kb-popover-content-transform-origin] animate-contentHide overflow-hidden rounded-md border border-gray-200 bg-gray-50 text-gray-600 shadow-sm ui-expanded:animate-contentShow"
            onCloseAutoFocus={handleReturnFocusToNavItem}
          >
            <div class="flex flex-col gap-0.5 p-0.5 text-sm">
              <ContextItem feed={props.feed} onClick={() => handleContextItemClick('refresh')}>
                Refresh
              </ContextItem>
              <ContextItem feed={props.feed} onClick={() => handleContextItemClick('rename')}>
                Rename
              </ContextItem>
              <ContextItem feed={props.feed} onClick={() => handleContextItemClick('delete')}>
                Delete
              </ContextItem>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover>
    </A>
  );
};
