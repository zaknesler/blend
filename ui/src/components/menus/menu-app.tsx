import { Button as BaseButton } from '@kobalte/core/button';
import { DropdownMenu, type DropdownMenuTriggerProps } from '@kobalte/core/dropdown-menu';
import {
  HiOutlineArrowDownTray,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars2,
  HiOutlineCog6Tooth,
  HiOutlineSquaresPlus,
} from 'solid-icons/hi';
import { TiCog } from 'solid-icons/ti';
import { type Component, mergeProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { SHORTCUTS } from '~/hooks/use-shortcuts';
import { openModal } from '~/stores/modal';
import { LogoSquare } from '../ui/logo';
import { Menu, type MenuProps } from './menu';

export const AppMenu: Component<MenuProps> = props => {
  const local = mergeProps(
    {
      triggerClass: 'size-6 rounded-md',
      triggerIconClass: 'size-5',
      triggerIcon: TiCog,
    } as MenuProps,
    props,
  );

  return (
    <Menu
      {...local}
      size="lg"
      trigger={() => (
        <DropdownMenu.Trigger
          as={(polyProps: DropdownMenuTriggerProps) => (
            <BaseButton
              {...polyProps}
              class="-m-1 inline-flex items-center gap-2 self-start rounded-lg p-1 pr-2 transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-opacity-30 dark:focus-visible:ring-gray-600 dark:hover:bg-gray-700"
            >
              <LogoSquare iconOnly class="inline-flex size-6" />
              <Dynamic component={HiOutlineBars2} class="size-5 text-gray-500 md:size-4 dark:text-gray-400" />
            </BaseButton>
          )}
        />
      )}
    >
      <Menu.Item
        label="Add feed"
        kbd={SHORTCUTS.OPEN_ADD_FEED_MODAL}
        icon={HiOutlineSquaresPlus}
        onSelect={() => openModal('createFeed')}
      />
      <Menu.Item label="Import/export" icon={HiOutlineArrowDownTray} disabled />
      <Menu.Item label="Settings" icon={HiOutlineCog6Tooth} disabled />
      <Menu.Item label="Sign out" icon={HiOutlineArrowRightOnRectangle} disabled />
    </Menu>
  );
};
