import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    side_panel: {
      default_path: 'sidepanel.html'
    },
    action: {
      default_title: 'Toggle Sidepanel'
    },
    permissions: [
      'sidePanel',
      'activeTab',
      'tabs'
    ]
  }
});
