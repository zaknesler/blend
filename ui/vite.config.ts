import devtools from 'solid-devtools/vite';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(async () => ({
  plugins: [solid(), tsconfigPaths(), devtools()],
}));
