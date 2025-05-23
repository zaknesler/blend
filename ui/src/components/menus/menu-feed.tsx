import { HiOutlineArrowPath, HiOutlineFolder, HiOutlinePencilSquare, HiOutlineTrash } from 'solid-icons/hi';
import { type Component, mergeProps } from 'solid-js';
import { useNotifications } from '~/contexts/notification-context';
import { useRefreshFeed } from '~/hooks/queries/use-refresh-feed';
import { openModal } from '~/stores/modal';
import { Menu, type MenuProps } from './menu';

type FeedMenuProps = MenuProps & {
  uuid: string;
};

export const FeedMenu: Component<FeedMenuProps> = props => {
  const local = mergeProps(
    {
      triggerClass: 'size-5 rounded',
      triggerIconClass: 'size-4',
    } as MenuProps,
    props,
  );

  const refreshFeed = useRefreshFeed();
  const notifications = useNotifications();

  const isRefreshing = () => notifications.isFeedRefreshing(props.uuid);

  return (
    <Menu {...local} size="sm">
      <Menu.Item
        label="Refresh"
        onSelect={() => refreshFeed(props.uuid)}
        icon={HiOutlineArrowPath}
        iconClass={isRefreshing() && 'animate-spin'}
        disabled={isRefreshing()}
      />

      <Menu.Item
        label="Move"
        onSelect={() => openModal('moveFeed', { feed_uuid: props.uuid })}
        icon={HiOutlineFolder}
        disabled={isRefreshing()}
      />
      <Menu.Item label="Rename" disabled icon={HiOutlinePencilSquare} />
      <Menu.Item label="Delete" disabled icon={HiOutlineTrash} />
    </Menu>
  );
};
