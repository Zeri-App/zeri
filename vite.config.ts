import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const { version }: { version: string } = JSON.parse(
  fs.readFileSync(path.join(dirname, 'package.json'), 'utf-8')
);

export default defineConfig({
  plugins: [sveltekit()],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 5173,
    strictPort: true
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
  define: {
    __APP_VERSION__: `'${version}'`
  }
});
