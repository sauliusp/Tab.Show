export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // Set up sidepanel to open when extension icon is clicked
  browser.runtime.onInstalled.addListener(async (details) => {
    try {
      console.log('Setting up sidepanel behavior...');
      await browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
      console.log('Sidepanel behavior set successfully');
    } catch (error) {
      console.error('Error setting sidepanel behavior:', error);
    }

    // Handle Welcome and What's New pages
    if (details.reason === 'update') {
      // The 'previousVersion' property is available on update
      const newVersion = browser.runtime.getManifest().version;
      const oldVersion = details.previousVersion;

      console.log(`Extension updated from ${oldVersion} to ${newVersion}.`);

      // Compare versions to ensure we only open the page on a genuine update
      if (newVersion !== oldVersion) {
        console.log('A new version is available. Opening the "What\'s New" page.');

        // Define the URL for your "What's New" page
        const url = `${browser.runtime.getURL('')}pages/whats-new/index.html`;
        
        // Use the browser.tabs API to create a new tab
        browser.tabs.create({ url });
      }
    } else if (details.reason === 'install') {
      // This block runs when the user installs the extension for the first time
      console.log('Extension first installed. Opening the Welcome page.');
      
      // Open the "Welcome" page
      const url = `${browser.runtime.getURL('')}pages/welcome/index.html`;
      browser.tabs.create({ url });
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
