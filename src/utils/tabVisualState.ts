import { Tab, TabVisualState } from '../types/Tab';
import { tabService } from '../services/TabService';

// Cache for visual state calculations to avoid recalculation
const visualStateCache = new Map<string, TabVisualState>();
const MAX_CACHE_SIZE = 1000; // Prevent memory leaks

// Helper function to create cache key
function createCacheKey(tab: Tab, previewTabId: number | null, originalTab: Tab | null): string {
  return `${tab.id}-${previewTabId}-${originalTab?.id}-${tab.status}-${tab.lastAccessed}-${tab.groupId}`;
}

// Helper function to clean cache when it gets too large
function cleanCache(): void {
  if (visualStateCache.size > MAX_CACHE_SIZE) {
    const keys = Array.from(visualStateCache.keys());
    // Remove oldest 20% of entries
    const keysToRemove = keys.slice(0, Math.floor(MAX_CACHE_SIZE * 0.2));
    keysToRemove.forEach(key => visualStateCache.delete(key));
  }
}

export function getTabVisualState(
  tab: Tab,
  previewTabId: number | null,
  originalTab: Tab | null,
  theme: any
): TabVisualState {
  const cacheKey = createCacheKey(tab, previewTabId, originalTab);
  
  // Check cache first
  if (visualStateCache.has(cacheKey)) {
    return visualStateCache.get(cacheKey)!;
  }
  
  const isPreviewTab = previewTabId === tab.id;
  const isOriginalTab = originalTab?.id === tab.id;
  const isLoading = tab.status === 'loading';
  const hasErrors = tab.status === 'unloaded' || tab.status === 'error';
  const isStale = tabService.isTabStale(tab);
  
  const visualState: TabVisualState = {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    avatarOverlays: [],
    textColor: theme.palette.text.primary,
    opacity: 1,
    avatarFilter: 'none'
  };
  
  // Apply state logic in priority order
  
  // 1. Original tab (highest priority)
  if (isOriginalTab) {
    visualState.borderColor = theme.palette.custom.original;
    visualState.backgroundColor = theme.palette.custom.original + '40';
    visualState.avatarOverlays.push({
      type: 'checkmark',
      color: theme.palette.custom.original,
      position: 'bottom-right'
    });
  }
  
  // 2. Preview tab
  if (isPreviewTab) {
    visualState.borderColor = theme.palette.custom.preview;
    visualState.backgroundColor = theme.palette.custom.preview + '40';
    if (!isOriginalTab) {
      visualState.avatarOverlays.push({
        type: 'preview',
        color: theme.palette.custom.preview,
        position: 'top-right'
      });
    }
  }
  
  // 3. Loading state
  if (isLoading) {
    visualState.avatarOverlays.push({
      type: 'loading',
      color: theme.palette.custom.loading,
      position: 'top-right'
    });
  }
  
  // 4. Error state
  if (hasErrors) {
    visualState.borderColor = theme.palette.error.main;
    visualState.backgroundColor = theme.palette.error.main + '30';
    visualState.textColor = theme.palette.error.main;
    visualState.avatarOverlays.push({
      type: 'error',
      color: theme.palette.error.main,
      position: 'top-left'
    });
  }
  
  // 5. Stale state
  if (isStale) {
    if (!visualState.borderColor || visualState.borderColor === 'transparent') {
      visualState.borderColor = theme.palette.warning.main;
    }
    if (!visualState.backgroundColor || visualState.backgroundColor === 'transparent') {
      visualState.backgroundColor = theme.palette.warning.main + '30';
    }
    visualState.opacity = 0.6;
    visualState.avatarFilter = 'grayscale(0.3) saturate(0.7)';
    visualState.avatarOverlays.push({
      type: 'stale',
      color: theme.palette.warning.main,
      position: 'bottom-left'
    });
  }
  
  // 6. Combined states - adjust background for multiple states
  if (isOriginalTab && isPreviewTab) {
    visualState.backgroundColor = theme.palette.secondary.main + '90';
    visualState.textColor = 'white';
  }
  
  // Cache the result and clean if necessary
  visualStateCache.set(cacheKey, visualState);
  cleanCache();
  
  return visualState;
}

// Function to clear cache when needed (e.g., on theme change)
export function clearVisualStateCache(): void {
  visualStateCache.clear();
}
