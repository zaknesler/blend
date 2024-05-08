import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig(async () => ({
  plugins: [solid(), tsconfigPaths(), devtools()],
}));
