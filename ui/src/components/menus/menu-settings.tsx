import { TiCog } from 'solid-icons/ti';
import { type Component, mergeProps } from 'solid-js';
import { Menu, type MenuProps } from './menu';

export const MenuSettings: Component<MenuProps> = props => {
  const local = mergeProps(
    {
      triggerClass: 'h-6 w-6 rounded-md',
      triggerIconClass: 'h-5 w-5 text-gray-500',
      triggerIcon: TiCog,
    } as MenuProps,
    props,
  );

  return (
    <Menu {...local}>
      <Menu.Item disabled>Import/export</Menu.Item>
      <Menu.Item disabled>Settings</Menu.Item>
      <Menu.Item disabled>Sign out</Menu.Item>
    </Menu>
  );
};
