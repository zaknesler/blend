import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { makeViewportContext, ViewportContext } from './contexts/viewport-context';
import 'solid-devtools';
import './styles/app.css';

const App = lazy(() => import('./app'));

render(() => {
  const viewport = makeViewportContext();

  return (
    <ViewportContext.Provider value={viewport}>
      <App />
    </ViewportContext.Provider>
  );
}, document.getElementById('root')!);
