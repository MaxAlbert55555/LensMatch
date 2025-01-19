import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'three': resolve(__dirname, './node_modules/three'),
      'postprocessing': resolve(__dirname, './node_modules/postprocessing'),
    },
  },
  base: "./", // Basis für relative Pfade
  server: {
    open: true, // Automatisch im Browser öffnen
  },
});
