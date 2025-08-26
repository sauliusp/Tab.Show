import React from 'react';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import { Tab } from '../types/Tab';
import { TabItem } from './TabItem';

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
  
  // Reset shown groups when tabs or groups change
  React.useEffect(() => {
    shownGroups.current.clear();
  }, [allTabs, tabGroups]);
  
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
            {/* Show group header only for the first tab in a group */}
            {isFirstTabInGroup && group && (
              <div style={{
                backgroundColor: group.color === 'grey' ? '#8e8e93' : 
                               group.color === 'blue' ? '#007aff' :
                               group.color === 'red' ? '#ff3b30' :
                               group.color === 'green' ? '#34c759' :
                               group.color === 'yellow' ? '#ffcc00' :
                               group.color === 'pink' ? '#ff2d92' :
                               group.color === 'purple' ? '#af52de' :
                               group.color === 'orange' ? '#ff9500' : '#8e8e93',
                color: 'white',
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: 'bold',
                borderRadius: '4px',
                margin: '4px 8px',
                textAlign: 'center'
              }}>
                {group.title || `Group ${group.id}`}
              </div>
            )}
            
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
            />
          </React.Fragment>
        );
      })}
    </List>
  );
}
