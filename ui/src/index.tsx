import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools';
import { render } from 'solid-js/web';
import Router from './router';
import './css/app.css';

const queryClient = new QueryClient();

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router />
      <SolidQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  ),
  document.getElementById('root')!,
);
