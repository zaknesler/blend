import type { RouteSectionProps } from '@solidjs/router';
import { useNotifications } from '~/hooks/use-notifications';

export default (props: RouteSectionProps) => {
  useNotifications();

  return <div class="relative flex h-full w-full">{props.children}</div>;
};
