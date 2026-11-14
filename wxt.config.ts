import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  publicDir: 'public',
  zip: {
    includeSources: [
      'entrypoints/**',
      'src/**',
      'assets/**',
      'public/**',
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'wxt.config.ts',
      'vitest.config.ts',
      'README.md',
    ],
  },
  manifest: {
    name: 'TabShow: Live Tab Preview',
    short_name: 'TabShow',
    description: 'Preview live Chrome tabs before you switch. Search your tabs and find the right page without losing your place.',
    version: '2.4.0',
    side_panel: {
      default_path: 'sidepanel.html'
    },
    action: {
      default_title: 'Toggle TabShow Side Panel'
    },
    commands: {
      // This is a reserved command name for the extension action
      '_execute_action': {
        suggested_key: {
          default: 'Ctrl+Shift+X',
          mac: 'Command+Shift+X',
        },
        description: 'Toggle the side panel', 
      },
    },
    permissions: [
      'sidePanel',
      'tabs',
      'tabGroups'
    ],
  }
});
