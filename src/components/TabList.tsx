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
import { ExpandLess, ExpandMore, Folder } from '@mui/icons-material';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { Tab, TabGroup, TabListItem, TabListState } from '../types/Tab';
import { SortableTabItem } from './SortableTabItem'; // <-- Import the new component

interface TabListProps {
  tabListState: TabListState;
  previewTabId: number | null;
  originalTab: Tab | null;
  onTabHover: (tabId: number) => void;
  onTabClick: (tabId: number) => void;
  onCloseTab: (tabId: number) => void;
  onGroupToggle: (groupId: number) => void;
  onDragEnd: (event: any) => void; // <-- New prop
  onDragStart: (event: any) => void;
  onDragOver: (event: any) => void;
}

export function TabList({
  tabListState,
  previewTabId,
  originalTab,
  onTabHover,
  onTabClick,
  onCloseTab,
  onGroupToggle,
  onDragEnd, // <-- New prop
  onDragStart,
  onDragOver
}: TabListProps) {
  const theme = useTheme();
  const parentRef = useRef<HTMLDivElement>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // Create a flattened list of all visible items for virtualization
  const virtualItems = useMemo(() => {
    const items: Array<{
      id: string;
      type: 'tab' | 'group';
      data: Tab | TabGroup;
      parentId?: string;
      isNested?: boolean;
    }> = [];
    
    tabListState.itemOrder.forEach((itemId: string) => {
      const item = tabListState.items[itemId];
      if (!item) return;
      
      if (item.type === 'group') {
        const group = item.data as TabGroup;
        const isExpanded = tabListState.groupExpansionState[group.id] !== false;
        
        // Add group header
        items.push({
          id: item.id,
          type: 'group',
          data: group,
          isNested: false
        });
        
        // Add group tabs if expanded
        if (isExpanded) {
          const groupTabs = Object.values(tabListState.items)
            .filter((tabItem: TabListItem) => tabItem.type === 'tab' && tabItem.parentId === `group-${group.id}`)
            .map((tabItem: TabListItem) => tabItem.data as Tab);
          
          groupTabs.forEach(tab => {
            items.push({
              id: `tab-${tab.id}`,
              type: 'tab',
              data: tab,
              parentId: `group-${group.id}`,
              isNested: true
            });
          });
        }
      } else if (item.type === 'tab') {
        // Ungrouped tab
        items.push({
          id: item.id,
          type: 'tab',
          data: item.data as Tab,
          isNested: false
        });
      }
    });
    
    return items;
  }, [tabListState]);
  
  // Set up the virtualizer
  const virtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = virtualItems[index];
      if (item.type === 'group') return 48; // Group header height
      return 38; // Tab item height
    },
    overscan: 5,
  });
  
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
      // Use SortableTabItem for tabs
      return (
        <SortableTabItem
          id={`tab-${tab.id}`}
          tab={tab}
          previewTabId={previewTabId}
          originalTab={originalTab}
          onTabHover={onTabHover}
  
          onTabClick={onTabClick}
          onCloseTab={onCloseTab}
          groupColor={groupColor}
        />
      );
    }
  };
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
    >
      <Box
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
        <SortableContext items={tabListState.itemOrder} strategy={verticalListSortingStrategy}>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const item = virtualItems[virtualItem.index];
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
        </SortableContext>
      </Box>
    </DndContext>
  );
}
