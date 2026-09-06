import tailwindcss from '@tailwindcss/vite';
import devtools from 'solid-devtools/vite';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid(), devtools(), tailwindcss()],
  resolve: { tsconfigPaths: true },
});
