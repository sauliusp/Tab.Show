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

  /**
   * Close a specific tab by ID
   */
  async closeTab(tabId: number): Promise<boolean> {
    try {
      await browser.tabs.remove(tabId);
      return true;
    } catch (error) {
      console.error(`Failed to close tab ${tabId}:`, error);
      return false;
    }
  }

  /**
   * Get all tab groups in the current window
   */
  async getTabGroups(): Promise<any[]> {
    try {
      const windowId = await this.getCurrentWindowId();
      console.log('getTabGroups - windowId:', windowId);
      if (windowId === null) return [];
      
      // Check if browser.tabGroups is available
      if (!browser.tabGroups) {
        console.log('browser.tabGroups is not available');
        return [];
      }
      
      console.log('Using browser.tabGroups API');
      const groups = await browser.tabGroups.query({ windowId });
      console.log('getTabGroups - browser.tabGroups.query result:', groups);
      return groups;
    } catch (error) {
      console.error('Failed to get tab groups:', error);
      return [];
    }
  }

  /**
   * Toggle the collapse state of a tab group
   */
  async toggleTabGroupCollapse(groupId: number): Promise<boolean> {
    try {
      // Check if browser.tabGroups is available
      if (!browser.tabGroups) {
        console.log('browser.tabGroups is not available');
        return false;
      }

      // Get the current group state
      const groups = await this.getTabGroups();
      const group = groups.find(g => g.id === groupId);
      
      if (!group) {
        console.error(`Group with ID ${groupId} not found`);
        return false;
      }

      // Toggle the collapsed state
      const newCollapsedState = !group.collapsed;
      
      console.log(`Toggling group ${groupId} collapsed state to:`, newCollapsedState);
      
      // Update the group
      await browser.tabGroups.update(groupId, { collapsed: newCollapsedState });
      
      return true;
    } catch (error) {
      console.error(`Failed to toggle group ${groupId} collapse state:`, error);
      return false;
    }
  }

  /**
   * Move a tab to a new position within the window
   */
  async moveTab(tabId: number, newIndex: number): Promise<void> {
    try {
      await browser.tabs.move(tabId, { index: newIndex });
    } catch (error) {
      console.error(`Failed to move tab ${tabId} to index ${newIndex}:`, error);
      // We can re-throw the error if we want the caller to handle it
      throw error;
    }
  }
}

export const tabService = TabService.getInstance();
