import { Button as BaseButton } from '@kobalte/core/button';
import { DropdownMenu, type DropdownMenuTriggerProps } from '@kobalte/core/dropdown-menu';
import {
  HiSolidArrowDownTray,
  HiSolidArrowRightOnRectangle,
  HiSolidChevronDown,
  HiSolidCog6Tooth,
  HiSolidPlus,
} from 'solid-icons/hi';
import { TiCog } from 'solid-icons/ti';
import { type Component, createSignal, mergeProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { LogoSquare } from '../../constants/ui/logo';
import { CreateFeedModal } from '../modals/create-feed-modal';
import { Menu, type MenuProps } from './menu';

export const AppMenu: Component<MenuProps> = props => {
  const [createFeedModalOpen, setCreateFeedModalOpen] = createSignal(false);

  const local = mergeProps(
    {
      triggerClass: 'size-6 rounded-md',
      triggerIconClass: 'size-5',
      triggerIcon: TiCog,
    } as MenuProps,
    props,
  );

  const handleAddFeed = () => {
    setCreateFeedModalOpen(true);
  };

  return (
    <>
      <Menu
        {...local}
        shift={4}
        trigger={() => (
          <DropdownMenu.Trigger
            as={(polyProps: DropdownMenuTriggerProps) => (
              <BaseButton
                {...polyProps}
                class="-m-1 inline-flex items-center gap-2 self-start rounded-lg p-1 pr-2 transition dark:hover:bg-gray-700 hover:bg-gray-200 focus:outline-none dark:focus:ring-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-30"
              >
                <LogoSquare iconOnly class="inline-flex size-6" />
                <Dynamic component={HiSolidChevronDown} class="size-4 text-gray-500 dark:text-gray-400" />
              </BaseButton>
            )}
          />
        )}
      >
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
