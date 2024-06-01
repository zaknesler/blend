import { HiSolidArrowPath } from 'solid-icons/hi';
import { type Component, mergeProps } from 'solid-js';
import { useRefreshFeeds } from '~/hooks/queries/use-refresh-feeds';
import { Menu, type MenuProps } from './menu';

export const MenuFeeds: Component<MenuProps> = props => {
  const local = mergeProps(
    {
      triggerClass: 'h-5 w-5 rounded',
      triggerIconClass: 'h-4 w-4 text-gray-500',
    } as MenuProps,
    props,
  );

  const refresh = useRefreshFeeds();

  const handleRefreshFeeds = () => {
    refresh.refreshFeeds();
    props.setOpen(false);
  };

  return (
    <Menu {...local} size="lg">
      <Menu.Item onSelect={handleRefreshFeeds} icon={HiSolidArrowPath}>
        Refresh all feeds
      </Menu.Item>
    </Menu>
  );
};
