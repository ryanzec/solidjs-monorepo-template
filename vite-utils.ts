import path from 'path';

import { CSSModulesOptions } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import solidPlugin from 'vite-plugin-solid';

const baseConfiguration = {
  resolve: {
    alias: {
      $: path.join(__dirname, 'packages'),
      $sandbox: path.join(__dirname, 'applications', 'sandbox', 'packages'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase' as CSSModulesOptions['localsConvention'],
    },
  },
  plugins: [solidPlugin(), EnvironmentPlugin('all')],
  server: {
    watch: {
      ignored: ['**/coverage/**'],
    },
  },

  // not sure why but this is required for the solid-dnd package to work
  // reference: https://github.com/thisbeyond/solid-dnd/issues/53#issuecomment-1272076800
  optimizeDeps: {
    extensions: ['jsx'],

    // prevents React related error with this library
    // reference: https://github.com/solidjs/vite-plugin-solid/issues/41
    // exclude: ['@tanstack/solid-query'],
  },
};

export const viteUtils = {
  baseConfiguration,
};
