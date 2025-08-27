import { Tab, TabVisualState } from '../types/Tab';
import { tabService } from '../services/TabService';

// Cache for visual state calculations to avoid recalculation
const visualStateCache = new Map<string, TabVisualState>();
const MAX_CACHE_SIZE = 1000; // Prevent memory leaks

// Helper function to create cache key
function createCacheKey(tab: Tab, previewTabId: number | null, originalTab: Tab | null, groupColor?: string): string {
  return `${tab.id}-${previewTabId}-${originalTab?.id}-${tab.status}-${tab.lastAccessed}-${tab.groupId}-${groupColor}`;
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

// Helper function to get group background color
function getGroupBackgroundColor(groupColor?: string): string {
  if (!groupColor) return 'transparent';
  
  const colorMap: Record<string, string> = {
    'grey': 'rgba(142, 142, 147, 0.1)',
    'blue': 'rgba(0, 122, 255, 0.1)',
    'red': 'rgba(255, 59, 48, 0.1)',
    'green': 'rgba(52, 199, 89, 0.1)',
    'yellow': 'rgba(255, 204, 0, 0.1)',
    'pink': 'rgba(255, 45, 146, 0.1)',
    'purple': 'rgba(175, 82, 222, 0.1)',
    'orange': 'rgba(255, 149, 0, 0.1)'
  };
  
  return colorMap[groupColor] || 'rgba(142, 142, 147, 0.1)';
}

// Helper function to get hover background color
function getHoverBackgroundColor(
  baseBackground: string, 
  groupColor: string | undefined, 
  theme: any
): string {
  if (baseBackground !== 'transparent') {
    return baseBackground === theme.palette.secondary.main
      ? theme.palette.secondary.main
      : baseBackground + '80';
  }
  
  return groupColor ? groupColor : theme.palette.action.hover;
}

export function getTabVisualState(
  tab: Tab,
  previewTabId: number | null,
  originalTab: Tab | null,
  theme: any,
  groupColor?: string
): TabVisualState {
  const cacheKey = createCacheKey(tab, previewTabId, originalTab, groupColor);
  
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
    avatarFilter: 'none',
    listItemStyles: {},
    avatarStyles: {},
    textStyles: {},
    pseudoElementStyles: {
      before: {},
      after: {}
    },
    hoverStyles: {}
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
  
  // Generate comprehensive styling
  const groupBgColor = getGroupBackgroundColor(groupColor);
  const finalBackgroundColor = visualState.backgroundColor !== 'transparent' 
    ? visualState.backgroundColor 
    : groupBgColor;
  
  // List item styles
  visualState.listItemStyles = {
    backgroundColor: finalBackgroundColor,
    paddingTop: '3px',
    paddingBottom: '3px',
    paddingLeft: '15px',
    paddingRight: '20px',
    opacity: visualState.opacity,
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    backgroundImage: visualState.opacity < 1 
      ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)' 
      : 'none'
  };
  
  // Pseudo-element styles
  visualState.pseudoElementStyles.before = {
    content: '""',
    position: 'absolute' as const,
    left: 0,
    top: 0,
    bottom: 0,
    width: '6px',
    backgroundColor: visualState.borderColor,
    zIndex: 1
  };
  
  if (groupColor) {
    visualState.pseudoElementStyles.after = {
      content: '""',
      position: 'absolute' as const,
      right: 0,
      top: 0,
      bottom: 0,
      width: '6px',
      backgroundColor: groupColor,
      zIndex: 1
    };
  }
  
  // Avatar styles
  visualState.avatarStyles = {
    width: 25,
    height: 25,
    position: 'relative' as const,
    border: originalTab?.id === tab.id ? `2px solid ${theme.palette.custom.original}` : 'none',
    filter: visualState.avatarFilter
  };
  
  // Text styles
  visualState.textStyles = {
    fontWeight: 'normal',
    color: visualState.textColor,
    fontSize: '0.875rem'
  };
  
  // Hover styles
  visualState.hoverStyles = {
    backgroundColor: getHoverBackgroundColor(visualState.backgroundColor, groupColor, theme)
  };
  
  // Cache the result and clean if necessary
  visualStateCache.set(cacheKey, visualState);
  cleanCache();
  
  return visualState;
}

// Function to clear cache when needed (e.g., on theme change)
export function clearVisualStateCache(): void {
  visualStateCache.clear();
}
