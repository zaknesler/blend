import { Router, Route } from '@solidjs/router';
import { lazy } from 'solid-js';

export default () => (
  <Router root={lazy(() => import('./layouts/base'))}>
    <Route path="/" component={lazy(() => import('./pages/index'))} />
    <Route path="/article" component={lazy(() => import('./pages/article'))} />
    <Route path="/feeds/:feed_uuid">
      <Route path={['/', '/entries/:entry_uuid']} component={lazy(() => import('./pages/feed'))} />
    </Route>
    <Route path="*" component={lazy(() => import('./pages/404'))} />
  </Router>
);
