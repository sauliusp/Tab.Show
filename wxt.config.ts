import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  publicDir: 'public',
  manifest: {
    name: 'TabShow | Point at Tabs in a Side Panel to See Full Pages Without Switching',
    short_name: 'TabShow',
    description: 'Vertical tabs with site icons and titles. Move your mouse over tabs to see a full page preview without switching. Click to switch.',
    version: '0.9.2',
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
      'activeTab',
      'tabs',
      'tabGroups'
    ],
  }
});
