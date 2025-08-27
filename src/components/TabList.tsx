import React from 'react';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import { Tab } from '../types/Tab';
import { TabItem } from './TabItem';
import { usePerformanceMonitor } from '../utils/performance';

interface TabListProps {
  allTabs: Tab[];
  tabGroups: any[];
  previewTabId: number | null;
  originalTab: Tab | null;
  onTabHover: (tabId: number) => void;
  onTabHoverEnd: () => void;
  onTabClick: (tabId: number) => void;
  onCloseTab: (tabId: number) => void;
}

export function TabList({
  allTabs,
  tabGroups,
  previewTabId,
  originalTab,
  onTabHover,
  onTabHoverEnd,
  onTabClick,
  onCloseTab
}: TabListProps) {
  const theme = useTheme();
  
  // Performance monitoring
  usePerformanceMonitor('TabList');
  
  // Debug logging
  console.log('TabList render:', { 
    allTabsCount: allTabs.length, 
    tabGroupsCount: tabGroups.length,
    tabGroups: tabGroups,
    allTabs: allTabs.map(t => ({ id: t.id, title: t.title, groupId: t.groupId }))
  });
  
  // Create a map of group IDs to group objects for quick lookup
  const groupMap = React.useMemo(() => {
    console.log('Creating groupMap from:', tabGroups);
    return new Map(tabGroups.map(group => [group.id, group]));
  }, [tabGroups]);
  
  // Track which groups we've already shown headers for
  const shownGroups = React.useRef(new Set<number>());
  
  // Reset shown groups only when tab groups change, not when individual tabs change
  // This prevents flickering when closing individual tabs - group headers remain stable
  React.useEffect(() => {
    shownGroups.current.clear();
  }, [tabGroups]);
  
  return (
    <List dense sx={{ 
      width: '100%', 
      bgcolor: 'background.paper',
      flex: 1,
      overflow: 'auto',
      paddingBottom: 0,
      marginBottom: 0,
      minHeight: 0
    }}>
      {allTabs.map(tab => {
        const group = tab.groupId ? groupMap.get(tab.groupId) : null;
        const isFirstTabInGroup = group && !shownGroups.current.has(tab.groupId!);
        
        // Mark this group as shown if it's the first tab
        if (isFirstTabInGroup) {
          shownGroups.current.add(tab.groupId!);
        }
        
        return (
          <React.Fragment key={tab.id}>            
            {/* Render the tab */}
            <TabItem
              tab={tab}
              previewTabId={previewTabId}
              originalTab={originalTab}
              onTabHover={onTabHover}
              onTabHoverEnd={onTabHoverEnd}
              onTabClick={onTabClick}
              onCloseTab={onCloseTab}
              groupColor={group?.color}
              groupTitle={group?.title}
            />
          </React.Fragment>
        );
      })}
    </List>
  );
}
