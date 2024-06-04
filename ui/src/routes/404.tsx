import { HiSolidArrowSmallLeft } from 'solid-icons/hi';
import { Panel } from '~/components/ui/layout/panel';
import { Link } from '~/components/ui/link';
import { Logo } from '~/components/ui/logo';

export default () => (
  <div class="size-full p-4 md:p-8">
    <Panel class="flex size-full flex-col items-start gap-8 rounded-lg p-8">
      <Logo />

      <div class="flex flex-col gap-4">
        <h2 class="font-black text-4xl">404</h2>
        <p class="text-gray-500">Page not found.</p>
        <Link href="/" class="flex items-center gap-2">
          <HiSolidArrowSmallLeft class="size-6 text-gray-400" />
          Home
        </Link>
      </div>
    </Panel>
  </div>
);
