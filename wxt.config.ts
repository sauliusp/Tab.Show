import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  publicDir: 'public',
  zip: {
    includeSources: [
      'entrypoints/**',
      'src/**',
      'scripts/**',
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
    default_locale: 'en',
    name: '__MSG_panelExtensionName__',
    short_name: '__MSG_panelExtensionShortName__',
    description: '__MSG_panelExtensionDescription__',
    version: '2.4.0',
    side_panel: {
      default_path: 'sidepanel.html'
    },
    action: {
      default_title: '__MSG_panelActionTitle__'
    },
    commands: {
      // This is a reserved command name for the extension action
      '_execute_action': {
        suggested_key: {
          default: 'Ctrl+Shift+X',
          mac: 'Command+Shift+X',
        },
        description: '__MSG_panelActionDescription__',
      },
    },
    permissions: [
      'sidePanel',
      'tabs',
      'tabGroups'
    ],
  }
});
