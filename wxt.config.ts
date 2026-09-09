import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  publicDir: 'public',
  manifest: {
    name: 'TabShow: Live Tab Preview',
    short_name: 'TabShow',
    description: 'Search or point at open tabs to preview the live page, then switch or snap back without losing your place.',
    version: '2.3.0',
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
