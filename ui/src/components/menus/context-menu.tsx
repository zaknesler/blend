import {
  type ContextMenuRootProps,
  ContextMenu as KbContextMenu,
  type ContextMenuItemProps as KbContextMenuItemProps,
} from '@kobalte/core/context-menu';
import type { VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'class-variance-authority/types';
import type { IconTypes } from 'solid-icons';
import { type Component, type JSX, type ParentComponent, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import * as menuClasses from '~/constants/ui/menu';

export type ContextMenuProps = ContextMenuRootProps &
  ContextMenuContentProps & {
    trigger?: () => JSX.Element;
  };

const ContextMenuRoot: ParentComponent<ContextMenuProps> = props => {
  const [local, rest] = splitProps(props, ['size', 'children', 'trigger']);

  return (
    <KbContextMenu {...rest} modal>
      <Dynamic component={local.trigger} />

      <KbContextMenu.Portal>
        <ContextMenuContent size={local.size}>{local.children}</ContextMenuContent>
      </KbContextMenu.Portal>
    </KbContextMenu>
  );
};

type ContextMenuItemProps = KbContextMenuItemProps & {
  label: string;
  icon?: IconTypes;
  iconClass?: ClassValue;
};

const ContextMenuItem: Component<ContextMenuItemProps> = props => {
  const [local, rest] = splitProps(props, ['icon', 'label', 'iconClass']);

  return (
    <KbContextMenu.Item {...rest} class={menuClasses.item()}>
      <Dynamic component={local.icon} class={menuClasses.itemIcon({ class: local.iconClass })} />
      {local.label}
    </KbContextMenu.Item>
  );
};

type ContextMenuContentProps = VariantProps<typeof menuClasses.content>;

const ContextMenuContent: ParentComponent<ContextMenuContentProps> = props => (
  <KbContextMenu.Content
    class={menuClasses.content({ class: 'origin-[--kb-menu-content-transform-origin]', size: props.size })}
  >
    <div class={menuClasses.contentInner()}>{props.children}</div>
  </KbContextMenu.Content>
);

const ContextMenuSeparator = () => <KbContextMenu.Separator class={menuClasses.contentSeparator()} />;

export const ContextMenu = Object.assign(ContextMenuRoot, {
  Item: ContextMenuItem,
  Content: ContextMenuContent,
  Separator: ContextMenuSeparator,
  Trigger: KbContextMenu.Trigger,
});
