import { Link, Meta, MetaProvider, Title } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import { Base } from './layouts/base';
import './app.css';

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>Blend</Title>

          <Meta charset="utf-8" />
          <Meta name="viewport" content="width=device-width, initial-scale=1" />
          <Link rel="icon" type="image/svg" href="/favicon.svg" />
          <Link rel="preconnect" href="https://fonts.googleapis.com" />
          <Link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <Link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap" rel="stylesheet" />

          <Base>
            <Suspense>{props.children}</Suspense>
          </Base>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}