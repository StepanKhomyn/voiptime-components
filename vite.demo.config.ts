import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  base: '/vue-component-lib/',
  root: path.resolve(__dirname, 'example'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // щоб працювало імпортування компонентів
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist-demo'),
    emptyOutDir: true,
  },
  plugins: [vue()],
});
