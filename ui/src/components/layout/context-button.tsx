import { Popover, PopoverRootProps } from '@kobalte/core/popover';
import { cx } from 'class-variance-authority';
import { type IconTypes } from 'solid-icons';
import { HiSolidEllipsisHorizontal } from 'solid-icons/hi';
import { type JSX, type ParentComponent, type Setter, createSignal, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

type ContextButton = Omit<PopoverRootProps, 'open' | 'onOpenChange'> & {
  open: boolean;
  setOpen: Setter<boolean>;
  forceFocus?: boolean;
  triggerIcon?: IconTypes;
  returnFocusToTrigger?: boolean;
  onlyDisplayForGroup?: boolean;
  triggerClass?: string;
  triggerIconClass?: string;
};

const ContextButtonRoot: ParentComponent<ContextButton> = props => {
  const [local, rest] = splitProps(props, [
    'children',
    'open',
    'setOpen',
    'forceFocus',
    'triggerIcon',
    'triggerClass',
    'triggerIconClass',
    'returnFocusToTrigger',
    'onlyDisplayForGroup',
  ]);

  const [navItemElement, setNavItemElement] = createSignal<HTMLAnchorElement>();

  const handleMenuClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    local.setOpen(true);
  };

  const handleReturnFocusToNavItem = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    navItemElement()?.focus();
  };

  return (
    <Popover placement="bottom-end" {...rest} open={local.open} onOpenChange={local.setOpen} modal>
      <Popover.Anchor>
        <Popover.Trigger
          as={() => (
            <ActionButton
              onClick={handleMenuClick}
              onlyDisplayForGroup={!!local.onlyDisplayForGroup}
              forceFocus={local.forceFocus || (local.onlyDisplayForGroup && local.open)}
              ref={setNavItemElement}
              class={local.triggerClass}
            >
              <Dynamic component={local.triggerIcon || HiSolidEllipsisHorizontal} class={local.triggerIconClass} />
            </ActionButton>
          )}
        />
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          class="z-50 w-28 origin-[--kb-popover-content-transform-origin] animate-contentHide overflow-hidden rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm ui-expanded:animate-contentShow"
          onCloseAutoFocus={local.returnFocusToTrigger ? handleReturnFocusToNavItem : undefined}
        >
          <div class="flex flex-col gap-0.5 p-1 text-sm">{local.children}</div>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
};

type ActionButtonProps = JSX.IntrinsicElements['button'] & {
  onlyDisplayForGroup: boolean;
  forceFocus?: boolean;
};

const ActionButton: ParentComponent<ActionButtonProps> = props => {
  const [local, rest] = splitProps(props, ['onlyDisplayForGroup', 'forceFocus', 'class']);

  return (
    <button
      {...rest}
      class={cx(
        'flex shrink-0 appearance-none items-center justify-center rounded border border-gray-200 transition',
        'focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200',
        local.onlyDisplayForGroup && 'opacity-0 focus:opacity-100 group-focus:opacity-100',
        local.onlyDisplayForGroup && local.forceFocus
          ? 'border-gray-500 bg-gray-100 opacity-100 outline-none ring-1 ring-gray-200'
          : 'bg-white hover:border-gray-300 hover:bg-gray-100 group-hover:opacity-100',
        props.class,
      )}
    >
      {props.children}
    </button>
  );
};

type ContextItemProps = Omit<JSX.IntrinsicElements['button'], 'onClick'> & {
  onClick: () => void;
};

const ContextItem: ParentComponent<ContextItemProps> = props => {
  const handleClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    props.onClick?.();
  };

  return (
    <button
      {...props}
      onClick={event => handleClick(event)}
      class={cx(
        'appearance-none rounded px-2 py-1 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none active:bg-gray-100',
      )}
    >
      {props.children}
    </button>
  );
};

export const ContextButton = Object.assign(ContextButtonRoot, {
  Item: ContextItem,
});
