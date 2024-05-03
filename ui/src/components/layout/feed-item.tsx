import { A } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiSolidRss } from 'solid-icons/hi';
import { Component, createSignal } from 'solid-js';
import { Feed } from '~/types/bindings/feed';
import { ContextButton } from './context-button';

type FeedItemProps = {
  feed: Feed;
};

export const FeedItem: Component<FeedItemProps> = props => {
  const [open, setOpen] = createSignal(false);

  return (
    <A
      href={`/feeds/${props.feed.uuid}`}
      class={cx(
        'group -mx-1 flex items-center gap-2 rounded-md border p-1 text-sm no-underline outline-none transition',
        'text-gray-600 ring-gray-200',
        'hover:border-gray-200 hover:bg-white hover:text-gray-900',
        'focus:border-gray-400 focus:ring-2',
        'focus-within:border-gray-300 focus-within:bg-white',
        open() ? 'border-gray-200 bg-white' : 'border-transparent',
      )}
    >
      <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-400">
        <HiSolidRss class="h-4 w-4 text-white" />
      </div>

      <span class="flex-1 overflow-x-hidden truncate">{props.feed.title}</span>

      <ContextButton
        onlyDisplayForGroup
        open={open()}
        setOpen={setOpen}
        shift={-6}
        gutter={8}
        triggerClass="h-5 w-5"
        triggerIconClass="w-4 h-4 text-gray-500"
      >
        <ContextButton.Item onClick={() => alert('refresh')}>Refresh</ContextButton.Item>
        <ContextButton.Item onClick={() => alert('rename')}>Rename</ContextButton.Item>
        <ContextButton.Item onClick={() => alert('delete')}>Delete</ContextButton.Item>
      </ContextButton>
    </A>
  );
};
