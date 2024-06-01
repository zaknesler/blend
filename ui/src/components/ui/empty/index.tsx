import { cx } from 'class-variance-authority';
import type { IconTypes } from 'solid-icons';
import type { ParentComponent } from 'solid-js';
import { Dynamic, Show, mergeProps } from 'solid-js/web';
import styles from './styles.module.css';

type EmptyProps = {
  icon?: IconTypes;
  dashed?: boolean;
  text?: string;
};

export const Empty: ParentComponent<EmptyProps> = props => {
  const local = mergeProps({ dashed: true } as EmptyProps, props);

  return (
    <div
      class={cx(
        'flex size-full select-none flex-col items-center justify-center gap-2 p-4 py-16 text-center',
        local.dashed && 'rounded-lg border-4 border-gray-200 border-dashed dark:border-gray-800',
      )}
    >
      <Show when={local.icon}>
        <Dynamic component={local.icon} class={cx('size-16 text-gray-300', styles.icon)} />
      </Show>

      <Show when={local.text}>
        <small class="text-gray-400 text-sm dark:text-gray-300">{local.text}</small>
      </Show>

      {local.children}
    </div>
  );
};
