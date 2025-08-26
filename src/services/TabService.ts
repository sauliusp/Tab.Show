import { Tab } from '../types/Tab';

class TabService {
  private static instance: TabService;
  
  private constructor() {}
  
  static getInstance() {
    if (!TabService.instance) {
      TabService.instance = new TabService();
    }
    return TabService.instance;
  }

  /**
   * Get all tabs in the current window
   */
  async getAllTabs(): Promise<Tab[]> {
    try {
      return await browser.tabs.query({ currentWindow: true }) as Tab[];
    } catch (error) {
      console.error('Failed to get all tabs:', error);
      return [];
    }
  }

  /**
   * Get the currently active tab
   */
  async getActiveTab(): Promise<Tab | null> {
    try {
      const [activeTab] = await browser.tabs.query({ 
        active: true, 
        currentWindow: true 
      });
      return activeTab as Tab || null;
    } catch (error) {
      console.error('Failed to get active tab:', error);
      return null;
    }
  }

  /**
   * Get a specific tab by ID
   */
  async getTabById(tabId: number): Promise<Tab | null> {
    try {
      const tab = await browser.tabs.get(tabId);
      return tab as Tab || null;
    } catch (error) {
      console.error(`Failed to get tab ${tabId}:`, error);
      return null;
    }
  }

  /**
   * Update a tab to be active
   */
  async activateTab(tabId: number): Promise<void> {
    try {
      await browser.tabs.update(tabId, { active: true });
    } catch (error) {
      console.error(`Failed to activate tab ${tabId}:`, error);
    }
  }

  /**
   * Check if a tab is stale (inactive for more than 7 days)
   */
  isTabStale(tab: Tab): boolean {
    if (!tab.lastAccessed) return false;
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return (Date.now() - tab.lastAccessed) > sevenDaysInMs;
  }

  /**
   * Get current window ID
   */
  async getCurrentWindowId(): Promise<number | null> {
    try {
      const window = await browser.windows.getCurrent();
      return window.id || null;
    } catch (error) {
      console.error('Failed to get current window ID:', error);
      return null;
    }
  }
}

export const tabService = TabService.getInstance();
