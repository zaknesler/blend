import { A, type AnchorProps } from '@solidjs/router';
import type { Component, ParentProps } from 'solid-js';

type Props = ParentProps<AnchorProps>;

export const Link: Component<Props> = props => (
  <A
    {...props}
    class="font-sans font-semibold text-gray-500 transition-colors hover:text-gray-800 hover:underline"
    classList={{ [String(props.class)]: !!props.class }}
  >
    {props.children}
  </A>
);
