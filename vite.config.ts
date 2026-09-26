import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          ar: path.resolve(__dirname, 'ar/index.html'),
          en: path.resolve(__dirname, 'en/index.html'),
        },
        output: {
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'https://temp-mail.ali-lamebarki.workers.dev',
          changeOrigin: true,
          secure: true,
          ws: true,
        },
      },
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'https://temp-mail.ali-lamebarki.workers.dev',
          changeOrigin: true,
          secure: true,
          ws: true,
        },
      },
    },
  };
});
