import { cx } from 'class-variance-authority';
import { JSX, ParentComponent, splitProps } from 'solid-js';

type PanelProps = JSX.IntrinsicElements['div'];

export const Panel: ParentComponent<PanelProps> = props => {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <div
      {...rest}
      class={cx('flex-1 overflow-auto bg-white p-4 md:rounded-lg md:p-8 md:shadow-md dark:bg-gray-900', local.class)}
    >
      {props.children}
    </div>
  );
};
