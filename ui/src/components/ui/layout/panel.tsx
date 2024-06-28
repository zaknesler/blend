import { cx } from 'class-variance-authority';
import { type JSX, type ParentComponent, splitProps } from 'solid-js';

type PanelProps = JSX.IntrinsicElements['div'];

export const Panel: ParentComponent<PanelProps> = props => {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <div
      {...rest}
      class={cx(
        'overflow-touch-scrolling flex-1 overflow-auto bg-white md:rounded-lg dark:bg-gray-900 dark:md:shadow-xl md:shadow-md',
        local.class,
      )}
    >
      {props.children}
    </div>
  );
};
