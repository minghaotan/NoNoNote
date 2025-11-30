import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const host = process.env.TAURI_DEV_HOST;

  return {
    server: {
      port: 3000,
      host: host || '0.0.0.0',
      strictPort: true,
      // Allow CORS for Tauri dev
      ...(host ? { cors: true } : {}),
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
    ],
    // Prevent clearing the screen in dev mode
    clearScreen: false,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      // Tauri uses Chromium on Windows and WebKit on macOS and Linux
      // Using modern targets for better performance
      target: process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome114' : 'safari16',
      // Don't minify for debug builds
      minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
      // Produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
  };
});
