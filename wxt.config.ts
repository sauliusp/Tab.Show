import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Narsheek: Hover Tab Preview',
    short_name: 'Narsheek',
    description: 'Get instant full-page previews by hovering over links and tabs. Find, switch, and organize without losing focus.',
    version: '0.6.1',
    side_panel: {
      default_path: 'sidepanel.html'
    },
    action: {
      default_title: 'Toggle Narsheek Side Panel'
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
      'tabGroups',
      'bookmarks',
      'storage',
      'history'
    ],
    host_permissions: [],
  }
});
