import {
  DropdownMenu,
  type DropdownMenuItemProps,
  type DropdownMenuRootProps,
  type DropdownMenuTriggerProps,
} from '@kobalte/core/dropdown-menu';
import { type VariantProps, cx } from 'class-variance-authority';
import type { IconTypes } from 'solid-icons';
import { HiSolidEllipsisHorizontal } from 'solid-icons/hi';
import { type ParentComponent, type Setter, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import * as menuClasses from '~/constants/ui/menu';

export type MenuProps = Omit<DropdownMenuRootProps, 'open' | 'onOpenChange'> &
  MenuContentProps & {
    open: boolean;
    setOpen: Setter<boolean>;
    triggerIcon?: IconTypes;
    triggerClass?: string;
    triggerIconClass?: string;
  };

const MenuRoot: ParentComponent<MenuProps> = props => {
  const [local, rest] = splitProps(props, [
    'size',
    'children',
    'open',
    'setOpen',
    'triggerIcon',
    'triggerClass',
    'triggerIconClass',
  ]);

  return (
    <DropdownMenu placement="bottom-end" {...rest} open={local.open} onOpenChange={local.setOpen} modal>
      <MenuTrigger class={cx('relative', local.triggerClass)}>
        <Dynamic component={local.triggerIcon || HiSolidEllipsisHorizontal} class={local.triggerIconClass} />
      </MenuTrigger>

      <DropdownMenu.Portal>
        <MenuContent size={local.size}>{local.children}</MenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
};

type MenuTrigger = DropdownMenuTriggerProps & {
  class?: string;
};

const MenuTrigger: ParentComponent<MenuTrigger> = props => {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <DropdownMenu.Trigger {...rest} class={menuClasses.trigger({ class: local.class })}>
      {props.children}
    </DropdownMenu.Trigger>
  );
};

type MenuItemProps = DropdownMenuItemProps & {
  icon?: IconTypes;
};

const MenuItem: ParentComponent<MenuItemProps> = props => {
  const [local, rest] = splitProps(props, ['icon']);

  return (
    <DropdownMenu.Item {...rest} class={menuClasses.item()}>
      <Dynamic component={local.icon} class="size-4 text-gray-400 dark:text-gray-500" />
      {props.children}
    </DropdownMenu.Item>
  );
};

type MenuContentProps = VariantProps<typeof menuClasses.content>;

const MenuContent: ParentComponent<MenuContentProps> = props => (
  <DropdownMenu.Content
    class={menuClasses.content({ class: 'origin-[--kb-menu-content-transform-origin]', size: props.size })}
  >
    <div class={menuClasses.contentInner()}>{props.children}</div>
  </DropdownMenu.Content>
);

export const Menu = Object.assign(MenuRoot, {
  Item: MenuItem,
  Content: MenuContent,
});
