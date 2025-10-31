import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  publicDir: 'public',
  manifest: {
    name: 'Tab.Show | Vertical Tabs in a Side Panel with Full-Page Previews on Hover',
    short_name: 'Tab.Show',
    description: 'Vertical tabs with thumbnails and titles in a side panel. Hover tabs to view a full-page preview without switching. Click to switch.',
    version: '0.9.1',
    side_panel: {
      default_path: 'sidepanel.html'
    },
    action: {
      default_title: 'Toggle Tab.Show Side Panel'
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
    host_permissions: undefined
  }
});
