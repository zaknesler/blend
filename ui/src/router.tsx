import { Route, Router } from '@solidjs/router';
import { lazy } from 'solid-js';

export default () => (
  <Router root={lazy(() => import('./layouts/base'))}>
    <Route
      path={['/', '/feeds/:feed_uuid', '/feeds/:feed_uuid/entries/:entry_uuid', '/entries/:entry_uuid']}
      component={lazy(() => import('./routes/feed'))}
    />
    <Route path="*" component={lazy(() => import('./routes/404'))} />
  </Router>
);
