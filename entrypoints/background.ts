export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // Set up sidepanel to open when extension icon is clicked
  browser.runtime.onInstalled.addListener(async () => {
    try {
      console.log('Setting up sidepanel behavior...');
      await browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
      console.log('Sidepanel behavior set successfully');
    } catch (error) {
      console.error('Error setting sidepanel behavior:', error);
    }
  });

  // Optional: Handle manual toggling if needed
  browser.action.onClicked.addListener(async (tab) => {
    console.log('Extension icon clicked for tab:', tab.id);
    console.log('Sidepanel should open automatically due to setPanelBehavior');
  });

  // Log when background script loads
  console.log('Background script loaded and ready');
});
