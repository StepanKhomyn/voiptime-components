// vite.config.ts
import { defineConfig } from "file:///home/user/WebstormProjects/vue-component-lib/node_modules/vite/dist/node/index.js";
import vue from "file:///home/user/WebstormProjects/vue-component-lib/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///home/user/WebstormProjects/vue-component-lib/node_modules/vite-plugin-dts/dist/index.mjs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///home/user/WebstormProjects/vue-component-lib/vite.config.ts";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }),
    dts({
      entryRoot: "src",
      outDir: "dist",
      include: ["src/**/*.ts", "src/**/*.vue"],
      exclude: ["**/*.test.*", "**/tests/**"],
      insertTypesEntry: true,
      rollupTypes: true,
      tsconfigPath: "./tsconfig.build.json",
      cleanVueFileName: true,
      copyDtsFiles: false,
      staticImport: true,
      beforeWriteFile: (filePath, content) => {
        return { filePath, content };
      }
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/entry.ts"),
      name: "VoiptimeComponents",
      // глобальне ім'я для window
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs", "umd"]
      // ДОДАНО umd
    },
    rollupOptions: {
      external: ["vue"],
      // не включаємо Vue у бандл
      output: {
        globals: {
          vue: "Vue"
          // Vue глобально в браузері
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) return "index.css";
          return assetInfo.name || "assets/[name].[ext]";
        }
      }
    },
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  esbuild: {
    target: "es2020"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS91c2VyL1dlYnN0b3JtUHJvamVjdHMvdnVlLWNvbXBvbmVudC1saWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3VzZXIvV2Vic3Rvcm1Qcm9qZWN0cy92dWUtY29tcG9uZW50LWxpYi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS91c2VyL1dlYnN0b3JtUHJvamVjdHMvdnVlLWNvbXBvbmVudC1saWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCBwYXRoLCB7IGRpcm5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xuXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgX19kaXJuYW1lID0gZGlybmFtZShfX2ZpbGVuYW1lKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSh7XG4gICAgICBzY3JpcHQ6IHtcbiAgICAgICAgZGVmaW5lTW9kZWw6IHRydWUsXG4gICAgICAgIHByb3BzRGVzdHJ1Y3R1cmU6IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIGR0cyh7XG4gICAgICBlbnRyeVJvb3Q6ICdzcmMnLFxuICAgICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnRzJywgJ3NyYy8qKi8qLnZ1ZSddLFxuICAgICAgZXhjbHVkZTogWycqKi8qLnRlc3QuKicsICcqKi90ZXN0cy8qKiddLFxuICAgICAgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcbiAgICAgIHJvbGx1cFR5cGVzOiB0cnVlLFxuICAgICAgdHNjb25maWdQYXRoOiAnLi90c2NvbmZpZy5idWlsZC5qc29uJyxcbiAgICAgIGNsZWFuVnVlRmlsZU5hbWU6IHRydWUsXG4gICAgICBjb3B5RHRzRmlsZXM6IGZhbHNlLFxuICAgICAgc3RhdGljSW1wb3J0OiB0cnVlLFxuICAgICAgYmVmb3JlV3JpdGVGaWxlOiAoZmlsZVBhdGgsIGNvbnRlbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgZmlsZVBhdGgsIGNvbnRlbnQgfTtcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9lbnRyeS50cycpLFxuICAgICAgbmFtZTogJ1ZvaXB0aW1lQ29tcG9uZW50cycsIC8vIFx1MDQzM1x1MDQzQlx1MDQzRVx1MDQzMVx1MDQzMFx1MDQzQlx1MDQ0Q1x1MDQzRFx1MDQzNSBcdTA0NTZcdTA0M0MnXHUwNDRGIFx1MDQzNFx1MDQzQlx1MDQ0RiB3aW5kb3dcbiAgICAgIGZpbGVOYW1lOiBmb3JtYXQgPT4gYGluZGV4LiR7Zm9ybWF0fS5qc2AsXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ2NqcycsICd1bWQnXSwgLy8gXHUwNDE0XHUwNDFFXHUwNDE0XHUwNDEwXHUwNDFEXHUwNDFFIHVtZFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsndnVlJ10sIC8vIFx1MDQzRFx1MDQzNSBcdTA0MzJcdTA0M0FcdTA0M0JcdTA0NEVcdTA0NDdcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgVnVlIFx1MDQ0MyBcdTA0MzFcdTA0MzBcdTA0M0RcdTA0MzRcdTA0M0JcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgdnVlOiAnVnVlJywgLy8gVnVlIFx1MDQzM1x1MDQzQlx1MDQzRVx1MDQzMVx1MDQzMFx1MDQzQlx1MDQ0Q1x1MDQzRFx1MDQzRSBcdTA0MzIgXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDQzXHUwNDM3XHUwNDM1XHUwNDQwXHUwNDU2XG4gICAgICAgIH0sXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiBhc3NldEluZm8gPT4ge1xuICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZT8uZW5kc1dpdGgoJy5jc3MnKSkgcmV0dXJuICdpbmRleC5jc3MnO1xuICAgICAgICAgIHJldHVybiBhc3NldEluZm8ubmFtZSB8fCAnYXNzZXRzL1tuYW1lXS5bZXh0XSc7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3NzQ29kZVNwbGl0OiBmYWxzZSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICB9LFxuICBlc2J1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VCxTQUFTLG9CQUFvQjtBQUN0VixPQUFPLFNBQVM7QUFDaEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sUUFBUSxlQUFlO0FBQzlCLFNBQVMscUJBQXFCO0FBSm9LLElBQU0sMkNBQTJDO0FBTW5QLElBQU0sYUFBYSxjQUFjLHdDQUFlO0FBQ2hELElBQU0sWUFBWSxRQUFRLFVBQVU7QUFFcEMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLE1BQ0YsUUFBUTtBQUFBLFFBQ04sYUFBYTtBQUFBLFFBQ2Isa0JBQWtCO0FBQUEsTUFDcEI7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxNQUNGLFdBQVc7QUFBQSxNQUNYLFFBQVE7QUFBQSxNQUNSLFNBQVMsQ0FBQyxlQUFlLGNBQWM7QUFBQSxNQUN2QyxTQUFTLENBQUMsZUFBZSxhQUFhO0FBQUEsTUFDdEMsa0JBQWtCO0FBQUEsTUFDbEIsYUFBYTtBQUFBLE1BQ2IsY0FBYztBQUFBLE1BQ2Qsa0JBQWtCO0FBQUEsTUFDbEIsY0FBYztBQUFBLE1BQ2QsY0FBYztBQUFBLE1BQ2QsaUJBQWlCLENBQUMsVUFBVSxZQUFZO0FBQ3RDLGVBQU8sRUFBRSxVQUFVLFFBQVE7QUFBQSxNQUM3QjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU8sS0FBSyxRQUFRLFdBQVcsY0FBYztBQUFBLE1BQzdDLE1BQU07QUFBQTtBQUFBLE1BQ04sVUFBVSxZQUFVLFNBQVMsTUFBTTtBQUFBLE1BQ25DLFNBQVMsQ0FBQyxNQUFNLE9BQU8sS0FBSztBQUFBO0FBQUEsSUFDOUI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxLQUFLO0FBQUE7QUFBQSxNQUNoQixRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxLQUFLO0FBQUE7QUFBQSxRQUNQO0FBQUEsUUFDQSxnQkFBZ0IsZUFBYTtBQUMzQixjQUFJLFVBQVUsTUFBTSxTQUFTLE1BQU0sRUFBRyxRQUFPO0FBQzdDLGlCQUFPLFVBQVUsUUFBUTtBQUFBLFFBQzNCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsV0FBVyxLQUFLO0FBQUEsSUFDcEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRO0FBQUEsRUFDVjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
