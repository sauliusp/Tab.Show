import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Tab } from '../types/Tab';
import { TabItem } from './TabItem';
import { usePerformanceMonitor } from '../utils/performance';

interface TabListProps {
  allTabs: Tab[];
  tabGroups: any[];
  previewTabId: number | null;
  originalTab: Tab | null;
  onTabHover: (tabId: number) => void;
  onTabClick: (tabId: number) => void;
  onCloseTab: (tabId: number) => void;
}

export function TabList({
  allTabs,
  tabGroups,
  previewTabId,
  originalTab,
  onTabHover,
  onTabClick,
  onCloseTab
}: TabListProps) {
  const theme = useTheme();
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  // Performance monitoring
  //usePerformanceMonitor('TabList');
  
  // Debug logging
  console.log('TabList render:', { 
    allTabsCount: allTabs.length, 
    tabGroupsCount: tabGroups.length,
    tabGroups: tabGroups,
    allTabs: allTabs.map(t => ({ id: t.id, title: t.title, groupId: t.groupId }))
  });
  
  // Create a map of group IDs to group objects for quick lookup
  const groupMap = useMemo(() => {
    console.log('Creating groupMap from:', tabGroups);
    return new Map(tabGroups.map(group => [group.id, group]));
  }, [tabGroups]);
  
  // Create virtualized items with group information
  const virtualItems = useMemo(() => {
    return allTabs.map(tab => {
      const group = tab.groupId ? groupMap.get(tab.groupId) : null;
      return {
        tab,
        groupColor: group?.color,
        groupTitle: group?.title
      };
    });
  }, [allTabs, groupMap]);
  
  // Set up the virtualizer
  const virtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 38, // Estimated height of each tab item (matches MUI ListItem dense)
    overscan: 5, // Render 5 extra items above and below the visible area
  });
  
  return (
    <div
      ref={parentRef}
      style={{
        height: '100%',
        width: '100%',
        overflow: 'auto',
        backgroundColor: theme.palette.background.paper,
        flex: 1,
        minHeight: 0
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const { tab, groupColor, groupTitle } = virtualItems[virtualItem.index];
          
          return (
            <div
              key={tab.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TabItem
                tab={tab}
                previewTabId={previewTabId}
                originalTab={originalTab}
                onTabHover={onTabHover}
                onTabClick={onTabClick}
                onCloseTab={onCloseTab}
                groupColor={groupColor}
                groupTitle={groupTitle}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
