import { A } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import { type Component } from 'solid-js';
import { useFilterParams } from '~/hooks/use-filter-params';
import { Entry } from '~/types/bindings/entry';
import { Feed } from '~/types/bindings/feed';

type EntryItemProps = {
  entry: Entry;
  feed: Feed;
};

export const EntryItem: Component<EntryItemProps> = props => {
  const filter = useFilterParams();

  return (
    <A
      href={filter.getEntryUrl(props.entry.uuid)}
      activeClass="bg-gray-100 dark:bg-gray-950"
      inactiveClass={cx('hover:bg-gray-100 dark:hover:bg-gray-950', props.entry.read_at && 'opacity-50')}
      class={cx(
        '-mx-2 flex flex-col gap-1 rounded-lg p-2 ring-gray-300 transition dark:ring-gray-700',
        'focus:bg-gray-100 focus:outline-none focus:ring focus:dark:bg-gray-950',
      )}
    >
      <h4 class="text-base/5 md:text-sm xl:text-base/5">{props.entry.title}</h4>
      <small class="flex w-full gap-1 text-xs text-gray-500 dark:text-gray-400">
        <span class="font-medium">{props.feed.title}</span>
        <span class="text-gray-300 dark:text-gray-600">&ndash;</span>
        <span>{dayjs(props.entry.published_at).format('MMMM d, YYYY')}</span>
      </small>
    </A>
  );
};
