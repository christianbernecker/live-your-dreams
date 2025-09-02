import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'LYDDesignSystem',
      fileName: (format) => `lyd-design-system.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3001,
    open: '/index.html'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
