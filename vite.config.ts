import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VoiptimeComponents',
      fileName: format => `index.${format}.js`,
      formats: ['es', 'cjs', 'umd'], // ДОДАНО umd
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue', // Vue глобально в браузері
        },
        assetFileNames: assetInfo => {
          if (assetInfo.name?.endsWith('.css')) return 'index.css';
          return assetInfo.name || 'assets/[name].[ext]';
        },
      },
    },
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    target: 'es2020',
  },
});
