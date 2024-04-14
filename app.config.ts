import { defineConfig } from '@solidjs/start/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  appRoot: './ui',
  vite({ router }) {
    if (router === 'server' || router === 'client') return { plugins: [tsconfigPaths()] };
    return { plugins: [] };
  },
});
