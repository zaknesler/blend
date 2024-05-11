import { type RouteSectionProps } from '@solidjs/router';
import { Sidebar } from '../components/layout/sidebar';
import { useWs } from '~/hooks/use-ws';

export default (props: RouteSectionProps) => {
  useWs();

  return (
    <div class="flex h-full w-full">
      <Sidebar class="hidden xl:flex xl:w-sidebar xl:shrink-0" />

      <div class="flex h-full w-full flex-1 gap-4 overflow-auto md:overflow-hidden md:p-4">{props.children}</div>
    </div>
  );
};
