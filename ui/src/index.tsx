import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import 'tailwindcss/tailwind.css';
import { FeedContext, makeFeedContext } from './contexts/feed';

render(() => {
  return (
    <FeedContext.Provider value={makeFeedContext()}>
      <Router root={lazy(() => import('./layouts/base'))}>
        <Route path="/" component={lazy(() => import('./pages/index'))} />
        <Route path="/new" component={lazy(() => import('./pages/new'))} />
        <Route path="/articles/:slug" component={lazy(() => import('./pages/article'))} />
        <Route path="*" component={lazy(() => import('./pages/404'))} />
      </Router>
    </FeedContext.Provider>
  );
}, document.getElementById('root')!);
