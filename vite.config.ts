import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
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
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['**/*.test.*', '**/tests/**'],
      insertTypesEntry: true,
      rollupTypes: true,
      tsconfigPath: './tsconfig.build.json',
      cleanVueFileName: true,
      copyDtsFiles: false,
      staticImport: true,
      beforeWriteFile: (filePath, content) => {
        return {
          filePath,
          content,
        };
      },
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/entry.ts'),
      name: 'VoiptimeComponents',
      fileName: format => `index.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
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
