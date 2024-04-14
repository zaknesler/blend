import { JSX, ParentProps } from 'solid-js';

type Props = ParentProps<JSX.IntrinsicElements['a']>;

export const Link = ({ children, ...props }: Props) => (
  <a
    {...props}
    class="font-sans font-semibold text-gray-500 transition-colors hover:text-gray-800 hover:underline"
    classList={{ [String(props.class)]: !!props.class }}
  >
    {children}
  </a>
);
