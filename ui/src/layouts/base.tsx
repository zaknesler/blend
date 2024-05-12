import { type RouteSectionProps } from '@solidjs/router';
import { useWs } from '~/hooks/use-ws';

export default (props: RouteSectionProps) => {
  useWs();

  return <div class="flex h-full w-full">{props.children}</div>;
};
