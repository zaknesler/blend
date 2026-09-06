import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools';
import { Show } from 'solid-js/web';
import { useViewport } from './contexts/viewport-context';
import Router from './router';
import 'solid-devtools';
import './styles/app.css';

const queryClient = new QueryClient();

export default () => {
  const viewport = useViewport();

  return (
    <QueryClientProvider client={queryClient}>
      <Router />

      <Show when={viewport.gt('md')}>
        <SolidQueryDevtools initialIsOpen={false} />
      </Show>
    </QueryClientProvider>
  );
};
