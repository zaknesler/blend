import { Component, mergeProps } from 'solid-js';
import { Menu, type MenuProps } from './menu';
import { useRefreshFeeds } from '~/hooks/queries/use-refresh-feeds';

export const MenuFeeds: Component<MenuProps> = props => {
  const local = mergeProps(
    {
      triggerClass: 'h-5 w-5 rounded',
      triggerIconClass: 'w-4 h-4 text-gray-500',
    } as MenuProps,
    props,
  );

  const refresh = useRefreshFeeds();

  const handleRefreshFeeds = () => {
    refresh.refreshFeeds();
    props.setOpen(false);
  };

  return (
    <Menu {...local}>
      <Menu.Item onSelect={handleRefreshFeeds}>Refresh all feeds</Menu.Item>
    </Menu>
  );
};
