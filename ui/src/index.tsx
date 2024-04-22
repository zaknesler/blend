import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import 'tailwindcss/tailwind.css';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools';

const queryClient = new QueryClient();

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router root={lazy(() => import('./layouts/base'))}>
        <Route path="/" component={lazy(() => import('./pages/index'))} />
        <Route path="/new" component={lazy(() => import('./pages/new'))} />
        <Route path="/articles/:slug" component={lazy(() => import('./pages/article'))} />
        <Route path="*" component={lazy(() => import('./pages/404'))} />
      </Router>

      <SolidQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  ),
  document.getElementById('root')!,
);
