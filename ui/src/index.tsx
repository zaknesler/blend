import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools';
import { Show, render } from 'solid-js/web';
import Router from './router';
import 'solid-devtools';
import './styles/app.css';
import { ViewportContext, makeViewportContext } from './contexts/viewport-context';

const queryClient = new QueryClient();

render(() => {
  const viewport = makeViewportContext();

  return (
    <ViewportContext.Provider value={viewport}>
      <QueryClientProvider client={queryClient}>
        <Router />

        <Show when={viewport.gtBreakpoint('md')}>
          <SolidQueryDevtools initialIsOpen={false} />
        </Show>
      </QueryClientProvider>
    </ViewportContext.Provider>
  );
}, document.getElementById('root')!);
