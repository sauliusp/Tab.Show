import React, { useMemo, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { useVirtualizer } from '@tanstack/react-virtual';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Collapse,
  Box,
  Typography
} from '@mui/material';
import { ExpandLess, ExpandMore, Folder, LaunchRounded } from '@mui/icons-material';
import type { Tab, TabGroup, TabListState, TabSortMode } from '../types/Tab';
import { TabItem } from './TabItem';
import { getDuplicateCounts, getDuplicateKey, selectTabs } from '../utils/tabSelectors';

interface TabListProps {
  isLoading: boolean;
  tabListState: TabListState;
  previewTabId: number | null;
  originalTab: Tab | null;
  onTabHover: (tabId: number) => void;
  onTabHoverEnd: (tabId: number) => void;
  onTabClick: (tabId: number) => void;
  onCloseTab: (tabId: number) => void;
  onGroupToggle: (groupId: number) => void;
  query: string;
  sortMode: TabSortMode;
  allWindows: boolean;
  currentWindowId: number | null;
  highlightedTabId: number | null;
  pointerPreviewEnabled: boolean;
  onPointerIntent: (tabId: number) => void;
}

export function TabList({
  isLoading,
  tabListState,
  previewTabId,
  originalTab,
  onTabHover,
  onTabHoverEnd,
  onTabClick,
  onCloseTab,
  onGroupToggle,
  query,
  sortMode,
  allWindows,
  currentWindowId,
  highlightedTabId,
  pointerPreviewEnabled,
  onPointerIntent
}: TabListProps) {
  const theme = useTheme();
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Create a flattened list of all visible items for virtualization
  const virtualItems = useMemo(() => {
    const items: Array<{
      id: string;
      type: 'tab' | 'group' | 'window';
      data: Tab | TabGroup | { title: string; subtitle: string };
      parentId?: string;
      isNested?: boolean;
    }> = [];
    
    const groups = new Map<number, TabGroup>();
    const tabs = Object.values(tabListState.items).flatMap((item) => {
      if (item.type === 'group') {
        const group = item.data as TabGroup;
        groups.set(group.id, group);
        return [];
      }
      return [item.data as Tab];
    });
    const sorted = selectTabs(tabs, { query, sortMode, currentWindowId });

    const allWindowIds = [...new Set(tabs.map(tab => tab.windowId ?? -1))].sort((a, b) => {
      if (a === currentWindowId) return -1;
      if (b === currentWindowId) return 1;
      return a - b;
    });

    const windowIds = [...new Set(sorted.map(tab => tab.windowId ?? -1))].sort((a, b) => {
      if (a === currentWindowId) return -1;
      if (b === currentWindowId) return 1;
      return a - b;
    });
    windowIds.forEach((windowId, windowIndex) => {
      const windowTabs = sorted.filter(tab => (tab.windowId ?? -1) === windowId);
      const isCurrent = windowId === currentWindowId;
      if (!isCurrent) {
        const windowNumber = allWindowIds.indexOf(windowId) + 1 || windowIndex + 1;
        items.push({
          id: `window-${windowId}`,
          type: 'window',
          data: {
            title: `Switch to window ${windowNumber}`,
            subtitle: 'Preview unavailable · click a tab to open that window',
          }
        });
      }
      let lastGroupId: number | undefined;
      windowTabs.forEach((tab) => {
        const group = tab.groupId !== undefined && tab.groupId >= 0 ? groups.get(tab.groupId) : undefined;
        const showGroupHeader = sortMode === 'current' || sortMode === 'group';
        if (showGroupHeader && group && group.id !== lastGroupId) {
          items.push({ id: `group-${group.id}`, type: 'group', data: group });
          lastGroupId = group.id;
        } else if (!group) lastGroupId = undefined;
        if (!showGroupHeader || !group || tabListState.groupExpansionState[group.id] !== false || Boolean(query.trim())) {
          items.push({ id: `tab-${tab.id}`, type: 'tab', data: tab, parentId: group ? `group-${group.id}` : undefined, isNested: Boolean(group) });
        }
      });
    });
    
    return items;
  }, [tabListState, query, sortMode, allWindows, currentWindowId]);

  const duplicateCounts = useMemo(() => {
    return getDuplicateCounts(Object.values(tabListState.items).filter(item => item.type === 'tab').map(item => item.data as Tab));
  }, [tabListState.items]);
  
  // Set up the virtualizer
  const virtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = virtualItems[index];
      if (item?.type === 'group') return 48; // Group header height
      if (item?.type === 'window') return 58;
      return 54; // Two-line tab row
    },
    overscan: 5,
  });

  const emptyState = isLoading
    ? { title: 'Loading tabs…', detail: 'Getting your Chrome windows ready.' }
    : query.trim()
      ? { title: 'No tabs match your search', detail: 'Try a different title, URL, or domain.' }
      : { title: 'No tabs in this scope', detail: allWindows ? 'Open a tab to see it here.' : 'Try All windows or open a tab in this window.' };

  React.useEffect(() => {
    const index = virtualItems.findIndex(item => item.type === 'tab' && (item.data as Tab).id === highlightedTabId);
    if (index >= 0 && (parentRef.current?.clientHeight ?? 0) > 0) virtualizer.scrollToIndex(index, { align: 'auto' });
  }, [highlightedTabId, virtualItems, virtualizer]);
  
  // Helper function to get group color
  const getGroupColor = (color?: string) => {
    const colorMap: Record<string, string> = {
      'grey': '#8E8E93',
      'blue': '#007AFF',
      'cyan': '#00C7BE',
      'red': '#FF3B30',
      'green': '#34C759',
      'yellow': '#FFCC00',
      'pink': '#FF2D92',
      'purple': '#AF52DE',
      'orange': '#FF9500'
    };
    return colorMap[color || 'grey'] || '#8E8E93';
  };
  
  // Render a virtual item
  const renderVirtualItem = (virtualItem: any, groupColor?: string) => {
    const { type, data, isNested } = virtualItem;
    
    if (type === 'window') {
      const windowSection = data as { title: string; subtitle: string };
      return (
        <Box sx={{
          mx: 1.25,
          my: 0.6,
          px: 1.1,
          py: 0.85,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderRadius: 2,
          color: 'text.secondary',
          backgroundColor: 'action.hover',
          border: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ width: 28, height: 28, flexShrink: 0, borderRadius: 1.5, display: 'grid', placeItems: 'center', color: 'text.secondary', backgroundColor: 'background.paper' }}>
            <LaunchRounded sx={{ fontSize: 15 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 11.5, lineHeight: 1.2, fontWeight: 850, letterSpacing: 0.1 }}>
              {windowSection.title}
            </Typography>
            <Typography sx={{ mt: 0.15, fontSize: 10.5, lineHeight: 1.3, color: 'text.secondary' }}>
              {windowSection.subtitle}
            </Typography>
          </Box>
        </Box>
      );
    }
    if (type === 'group') {
      const group = data as TabGroup;
      const isExpanded = tabListState.groupExpansionState[group.id] !== false;
      const groupColor = getGroupColor(group.color);
      
      return (
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => onGroupToggle(group.id)}
            sx={{
              pl: 2,
              pr: 2,
              py: 1,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Folder sx={{ color: groupColor, fontSize: 25 }} />
            </ListItemIcon>
            
            <ListItemText
              primary={
                <Typography 
                  variant="body1" 
                  sx={{ 
                    backgroundColor: groupColor,
                    padding: '2px 4px',
                    borderRadius: '5px', 
                    color: 'white',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 'calc(100% - 20px)',
                    display: 'inline-block',
                    float: 'left'
                  }}
                >
                  {group.title || 'Unnamed Group'}
                </Typography>
              }
            />
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
      );
    } else {
      const tab = data as Tab;
      return (
        <TabItem
          tab={tab}
          previewTabId={previewTabId}
          originalTab={originalTab}
          onTabHover={onTabHover}
          onTabHoverEnd={onTabHoverEnd}
          onTabClick={onTabClick}
          onCloseTab={onCloseTab}
          groupColor={groupColor}
          highlighted={highlightedTabId === tab.id}
          duplicateCount={duplicateCounts.get(getDuplicateKey(tab)) ?? 1}
          isOtherWindow={allWindows && tab.windowId !== currentWindowId}
          pointerPreviewEnabled={pointerPreviewEnabled}
          onPointerIntent={onPointerIntent}
        />
      );
    }
  };
  
  return (
    <Box
      id="tab-results"
      ref={parentRef}
      sx={{
        height: '100%',
        width: '100%',
        overflow: 'auto',
        backgroundColor: theme.palette.background.paper,
        flex: 1,
        minHeight: 0
      }}
    >
      {virtualItems.length === 0 ? (
        <Box
          role="status"
          aria-live="polite"
          sx={{
            minHeight: 180,
            height: '100%',
            px: 3,
            display: 'grid',
            placeContent: 'center',
            textAlign: 'center'
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 800, color: 'text.primary' }}>
            {emptyState.title}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 11.5, lineHeight: 1.45, color: 'text.secondary' }}>
            {emptyState.detail}
          </Typography>
        </Box>
      ) : (
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = virtualItems[virtualItem.index];
          if (!item) return null;
          let groupColor: string | undefined;
          
          if (item.isNested && item.parentId) {
            const groupItem = tabListState.items[item.parentId];
            if (groupItem && groupItem.type === 'group') {
              const group = groupItem.data as TabGroup;
              groupColor = getGroupColor(group.color);
            }
          }
          
          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
                paddingLeft: item.isNested ? theme.spacing(2) : 0,
              }}
            >
              {renderVirtualItem(item, groupColor)}
            </div>
          );
        })}
      </div>
      )}
    </Box>
  );
}
