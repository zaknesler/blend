import { Component } from 'solid-js';
import { Menu, type MenuProps } from '../ui/menu';
import { useRefreshFeed } from '~/hooks/queries/use-refresh-feed';
import { useRefreshFeeds } from '~/hooks/queries/use-refresh-feeds';

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

export const AllFeedsMenu: Component<MenuProps> = props => {
  const refresh = useRefreshFeeds();

  const handleSettings = () => console.log('clicky');

  const handleRefreshFeeds = () => {
    refresh.refreshFeeds();
    props.setOpen(false);
  };

  return (
    <Menu {...props}>
      <Menu.Item onSelect={handleSettings} disabled>
        Settings
      </Menu.Item>
      <Menu.Item onSelect={handleRefreshFeeds}>Refresh feeds</Menu.Item>
    </Menu>
  );
};
