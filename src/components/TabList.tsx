import React from 'react';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import { Tab } from '../types/Tab';
import { TabItem } from './TabItem';

interface TabListProps {
  allTabs: Tab[];
  previewTabId: number | null;
  originalTab: Tab | null;
  onTabHover: (tabId: number) => void;
  onTabHoverEnd: () => void;
  onTabClick: (tabId: number) => void;
  onShowPopover: (event: React.MouseEvent<HTMLElement>, message: string) => void;
}

export function TabList({
  allTabs,
  previewTabId,
  originalTab,
  onTabHover,
  onTabHoverEnd,
  onTabClick,
  onShowPopover
}: TabListProps) {
  const theme = useTheme();
  
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
      {allTabs.map(tab => (
        <TabItem
          key={tab.id}
          tab={tab}
          previewTabId={previewTabId}
          originalTab={originalTab}
          onTabHover={onTabHover}
          onTabHoverEnd={onTabHoverEnd}
          onTabClick={onTabClick}
          onShowPopover={onShowPopover}
        />
      ))}
    </List>
  );
}
