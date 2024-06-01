import { HiSolidArrowDownTray, HiSolidArrowRightOnRectangle, HiSolidCog6Tooth, HiSolidPlus } from 'solid-icons/hi';
import { TiCog } from 'solid-icons/ti';
import { type Component, createSignal, mergeProps } from 'solid-js';
import { CreateFeedModal } from '../modals/create-feed';
import { Menu, type MenuProps } from './menu';

export const MenuSettings: Component<MenuProps> = props => {
  const [createFeedModalOpen, setCreateFeedModalOpen] = createSignal(false);

  const local = mergeProps(
    {
      triggerClass: 'h-6 w-6 rounded-md',
      triggerIconClass: 'h-5 w-5 text-gray-500',
      triggerIcon: TiCog,
    } as MenuProps,
    props,
  );

  const handleAddFeed = () => {
    setCreateFeedModalOpen(true);
  };

  return (
    <>
      <Menu {...local}>
        <Menu.Item onSelect={handleAddFeed} icon={HiSolidPlus}>
          Add feed
        </Menu.Item>
        <Menu.Item disabled icon={HiSolidArrowDownTray}>
          Import/export
        </Menu.Item>
        <Menu.Item disabled icon={HiSolidCog6Tooth}>
          Settings
        </Menu.Item>
        <Menu.Item disabled icon={HiSolidArrowRightOnRectangle}>
          Sign out
        </Menu.Item>
      </Menu>

      <CreateFeedModal open={createFeedModalOpen()} setOpen={setCreateFeedModalOpen} />
    </>
  );
};
