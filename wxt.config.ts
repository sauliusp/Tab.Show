import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  publicDir: 'public',
  manifest: {
    name: 'Tab.Show | Hover. Preview. Focus.',
    short_name: 'Tab.Show | Hover. Preview. Focus.',
    description: 'Full-page tab previews on hover, right from a side panel - so you can manage dozens of tabs without losing focus.',
    version: '0.9.0',
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
      'tabGroups',
      'storage',
    ],
    host_permissions: undefined
  }
});
