import { A } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiSolidEllipsisHorizontal, HiSolidRss } from 'solid-icons/hi';
import { Component, JSX, ParentComponent, createSignal } from 'solid-js';
import { Feed } from '~/types/bindings/feed';
import { Popover } from '@kobalte/core/popover';
import './popover.css';

type FeedItemProps = {
  feed: Feed;
};

export const FeedItem: Component<FeedItemProps> = props => {
  const [open, setOpen] = createSignal(false);

  const handleMenuClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    setOpen(true);
  };

  return (
    <A
      href={`/feeds/${props.feed.uuid}`}
      class={cx(
        'group -mx-1 flex items-center gap-2 rounded-md border border-transparent p-1 text-sm no-underline outline-none transition',
        'text-gray-600 ring-gray-300',
        'hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900',
        'focus:border-gray-400 focus:ring-2',
        'focus-within:border-gray-300 focus-within:bg-gray-50',
        open() && 'border-gray-300 bg-gray-50',
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
          <Popover.Content class="popover__content">
            <div class="popover__header">
              <Popover.Title class="popover__title">About Kobalte</Popover.Title>
            </div>
            <Popover.Description class="popover__description">
              A UI toolkit for building accessible web apps and design systems with SolidJS.
            </Popover.Description>
          </Popover.Content>
        </Popover.Portal>
      </Popover>
    </A>
  );
};

type ActionButtonProps = JSX.IntrinsicElements['button'] & {
  forceFocus: boolean;
};

const ActionButton: ParentComponent<ActionButtonProps> = props => (
  <button
    {...props}
    class={cx(
      'flex h-5 w-5 shrink-0 appearance-none items-center justify-center rounded border border-gray-200 bg-white opacity-0 transition',
      'hover:border-gray-300 hover:bg-gray-100 group-hover:opacity-100',
      'focus:border-gray-500 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-gray-300 group-focus:opacity-100',
      props.forceFocus ? 'border-gray-500 opacity-100 outline-none ring-1 ring-gray-300' : '',
    )}
  >
    {props.children}
  </button>
);
