import { type RouteSectionProps } from '@solidjs/router';
import { Sidebar } from '../components/layout/sidebar';
import { useWs } from '~/hooks/use-ws';
import { Header } from '~/components/layout/header';

export default (props: RouteSectionProps) => {
  useWs();

  return (
    <div class="flex h-full w-full">
      <Sidebar class="hidden xl:flex xl:w-sidebar xl:shrink-0" />

      <div class="flex h-full w-full flex-1 flex-col overflow-auto">
        <Header class="sticky left-0 right-0 top-0 z-20 flex xl:hidden" />
        <div class="flex flex-1 gap-4 overflow-auto md:overflow-hidden md:p-4">{props.children}</div>
      </div>
    </div>
  );
};
