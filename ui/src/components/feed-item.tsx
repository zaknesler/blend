import { A } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiSolidEllipsisHorizontal, HiSolidRss } from 'solid-icons/hi';
import { Component, JSX, ParentComponent } from 'solid-js';
import { Feed } from '~/types/bindings/feed';

type FeedItemProps = {
  feed: Feed;
};

export const FeedItem: Component<FeedItemProps> = props => {
  const handleMenuClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    alert('menu clicky');
  };

  return (
    <A
      href={`/feeds/${props.feed.uuid}`}
      class={cx(
        'group -mx-1 flex items-center gap-2 rounded-md border border-transparent p-1 text-sm no-underline transition',
        'text-gray-600',
        'hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900',
        'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300',
      )}
    >
      <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-400">
        <HiSolidRss class="h-4 w-4 text-white" />
      </div>

      <span class="flex-1 overflow-x-hidden truncate">{props.feed.title}</span>

      <ActionButton onClick={handleMenuClick}>
        <HiSolidEllipsisHorizontal class="h-4 w-4 text-gray-700" />
      </ActionButton>
    </A>
  );
};

type ActionButtonProps = Omit<JSX.IntrinsicElements['button'], 'class'>;

const ActionButton: ParentComponent<ActionButtonProps> = props => (
  <button
    {...props}
    class={cx(
      'hidden h-5 w-5 shrink-0 appearance-none items-center justify-center rounded border border-gray-200 bg-white transition',
      'hover:border-gray-300 hover:bg-gray-100 group-focus-within:flex group-hover:flex group-focus:flex',
      'focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300',
    )}
  >
    {props.children}
  </button>
);
