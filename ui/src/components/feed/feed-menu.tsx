import { Component, mergeProps } from 'solid-js';
import { Menu, type MenuProps } from '../ui/menu';
import { createMutation } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';
import { refreshFeed } from '~/api/feeds';

type FeedMenuProps = MenuProps & {
  uuid: string;
};

export const FeedMenu: Component<FeedMenuProps> = props => {
  const local = mergeProps(
    {
      triggerClass: 'h-5 w-5',
      triggerIconClass: 'w-4 h-4 text-gray-500',
    },
    props,
  );

  const refresh = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_VIEW_REFRESH],
    mutationFn: refreshFeed,
  }));

  const handleRefresh = () => {
    refresh.mutateAsync(props.uuid);
    props.setOpen(false);
  };

  return (
    <Menu {...local}>
      <Menu.Item onSelect={handleRefresh}>Refresh</Menu.Item>
      <Menu.Item onSelect={() => alert('rename')} disabled>
        Rename
      </Menu.Item>
      <Menu.Item onSelect={() => alert('delete')} disabled>
        Delete
      </Menu.Item>
    </Menu>
  );
};
