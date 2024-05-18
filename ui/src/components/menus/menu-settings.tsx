import { Component, mergeProps } from 'solid-js';
import { Menu, MenuProps } from './menu';
import { TiCog } from 'solid-icons/ti';

export const MenuSettings: Component<MenuProps> = props => {
  const local = mergeProps(
    {
      triggerClass: 'w-6 h-6 rounded-md',
      triggerIconClass: 'w-5 h-5 text-gray-500',
      triggerIcon: TiCog,
    } as MenuProps,
    props,
  );

  return (
    <Menu {...local}>
      <Menu.Item onSelect={() => {}} disabled>
        Import/export
      </Menu.Item>
      <Menu.Item onSelect={() => {}} disabled>
        Settings
      </Menu.Item>
      <Menu.Item onSelect={() => {}} disabled>
        Sign out
      </Menu.Item>
    </Menu>
  );
};
