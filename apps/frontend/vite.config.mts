/// <reference types='vitest' />
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(() => ({
  build: {
    target: 'ES2023',
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  cacheDir: '../../node_modules/.vite/apps/frontend',
  define: {
    /*
     * solid-testing-library relies on "process" which is not shimmed by default
     */
    'process.env.STL_SKIP_AUTO_CLEANUP': 'false',
  },
  plugins: [solidPlugin(), tailwindcss()],
  preview: {
    host: 'localhost',
    port: 4200,
    // Remember to either strip, or update, proxy settings for production usage
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
    },
  },
  root: __dirname,
  server: {
    host: 'localhost',
    port: 4200,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
    },
  },
  test: {
    coverage: {
      provider: 'v8' as const,
      reportsDirectory: './test-output/vitest/coverage',
    },
    environment: 'jsdom',
    globals: true,
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    name: 'frontend',
    reporters: ['default'],
    watch: false,
  },
  // Uncomment this if you are using workers.
  /*
  worker: {
   plugins: [ nxViteTsPaths() ],
  },
  */
}));
