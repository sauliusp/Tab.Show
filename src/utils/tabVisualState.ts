import { Tab, TabVisualState } from '../types/Tab';
import { tabService } from '../services/TabService';

export function getTabVisualState(
  tab: Tab,
  previewTabId: number | null,
  originalTab: Tab | null,
  theme: any
): TabVisualState {
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
  
  return visualState;
}
