import { JSX, type ParentProps } from 'solid-js';

type Props = ParentProps<JSX.IntrinsicElements['button']>;

export const Button = ({ children, ...props }: Props) => (
  <button
    {...props}
    class="shrink-0 appearance-none rounded-lg bg-gray-500 px-4 py-2 text-white transition duration-100 hover:bg-gray-800"
    classList={{ [String(props.class)]: !!props.class }}
  >
    {children}
  </button>
);
