import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { comlink } from './vite-plugin-comlink';

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 5001, },
  plugins: [svelte(), comlink(),],
  worker: { plugins: [comlink()] },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/sims'),
      '@models': path.resolve(__dirname, './src/sims/models'),
      '@vizs': path.resolve(__dirname, './src/sims/vizs'),
      '@common': path.resolve(__dirname, './src/sims/common'),
    },
  },
});
