import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      '@app/types': './src/lib/types.ts',
      '@app/constants': './src/lib/constants.ts',
      '@app/components': './src/lib/components/',
      '@app/components/*': './src/lib/components/*',
      '@app/composables': './src/lib/composables/',
      '@app/composables/*': './src/lib/composables/*',
      '@app/stores': './src/lib/stores',
      '@app/stores/*': './src/lib/stores/*'
    }
  }
};

export default config;
