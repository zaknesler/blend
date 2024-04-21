import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig(async () => ({
  plugins: [solid(), tsconfigPaths()],
}));
