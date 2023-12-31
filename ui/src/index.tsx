import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import './css/app.css';

render(
  () => (
    <Router root={lazy(() => import('./layouts/base'))}>
      <Route path="/" component={lazy(() => import('./pages/index'))} />
      <Route path="/new" component={lazy(() => import('./pages/new'))} />
      <Route path="/articles/:slug" component={lazy(() => import('./pages/article'))} />
    </Router>
  ),
  document.getElementById('root')!,
);
