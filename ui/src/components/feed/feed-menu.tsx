import { Component } from 'solid-js';
import { Menu, type MenuProps } from '../ui/menu';
import { useRefreshFeed } from '~/hooks/queries/use-refresh-feed';

type FeedMenuProps = MenuProps & {
  uuid: string;
};

export const FeedMenu: Component<FeedMenuProps> = props => {
  const refresh = useRefreshFeed();

  const handleRefresh = () => {
    refresh.refreshFeed(props.uuid);
    props.setOpen(false);
  };

  return (
    <Menu {...props}>
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
