import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5402,
  },
  plugins: [preact()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@elements': path.resolve(__dirname, './src/elements'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@config': path.resolve(__dirname, './src/config'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@api': path.resolve(__dirname, './src/api'),
      '@lang': path.resolve(__dirname, './src/lang'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
});
