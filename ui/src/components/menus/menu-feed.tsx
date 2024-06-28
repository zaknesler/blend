import { HiOutlineFolder, HiOutlinePencilSquare, HiOutlineTrash } from 'solid-icons/hi';
import { type Component, mergeProps } from 'solid-js';
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

  return (
    <Menu {...local} size="sm">
      <Menu.Item label="Move" disabled icon={HiOutlineFolder} />
      <Menu.Item label="Rename" disabled icon={HiOutlinePencilSquare} />
      <Menu.Item label="Delete" disabled icon={HiOutlineTrash} />
    </Menu>
  );
};
