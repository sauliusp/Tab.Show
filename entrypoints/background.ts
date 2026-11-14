import { shouldOpenReleaseNotes } from '../src/utils/releaseNotes';

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async (details) => {
    try {
      await browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    } catch (error) {
      console.error('Could not enable the toolbar action:', error);
    }
    if (details.reason === 'install') {
      await browser.tabs.create({ url: browser.runtime.getURL('/pages/welcome/index.html') });
    } else if (details.reason === 'update' && shouldOpenReleaseNotes(
      details.previousVersion,
      browser.runtime.getManifest().version,
    )) {
      // Feature releases get one background tab. Patch updates never interrupt browsing.
      await browser.tabs.create({ url: browser.runtime.getURL('/pages/whats-new/index.html'), active: false });
    }
  });
});
