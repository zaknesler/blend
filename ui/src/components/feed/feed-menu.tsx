import { Component, mergeProps } from 'solid-js';
import { Menu, type MenuProps } from '../ui/menu';
import { useRefreshFeed } from '~/hooks/queries/use-refresh-feed';

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

  const refresh = useRefreshFeed();

  const handleRefresh = () => {
    refresh.refreshFeed(props.uuid);
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
