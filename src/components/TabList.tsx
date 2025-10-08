import React, { useMemo, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { useVirtualizer } from '@tanstack/react-virtual';
import { 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box,
  Typography,
  Paper
} from '@mui/material';
import { ExpandLess, ExpandMore, Folder, DragIndicator } from '@mui/icons-material';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Tab, TabGroup } from '../types/Tab';
import { TabItem } from './TabItem';
import { FlatListItem } from '../hooks/useTabs';

interface TabListProps {
  flatTabList: FlatListItem[];
  previewTabId: number | null;
  originalTab: Tab | null;
  activeDragItem: any | null;
  onTabHover: (tabId: number) => void;
  onTabClick: (tabId: number) => void;
  onCloseTab: (tabId: number) => void;
  onGroupToggle: (groupId: number) => void;
  onDragEnd: (event: any) => void;
  onDragStart: (event: any) => void;
  onDragOver: (event: any) => void;
  handleSidePanelHoverEnd: () => void;
}

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

function SortableItem(props: any) {
  const { item, onGroupToggle, ...rest } = props;
  const theme = useTheme();

  const { isDragging, attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
    disabled: item.type === 'group',
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  if (item.type === 'group') {
    const group = item.data as TabGroup;
    const groupColor = getGroupColor(group.color);
    return (
      <div ref={setNodeRef} style={style}>
        <ListItem disablePadding>
           <ListItemButton 
             onClick={() => onGroupToggle(group.id)}
             sx={{ pl: 2, pr: 2, py: 1, '&:hover': { backgroundColor: theme.palette.action.hover } }}
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
            {/* This needs groupExpansionState to work */}
            {/* {isExpanded ? <ExpandLess /> : <ExpandMore />} */}
           </ListItemButton>
         </ListItem>
      </div>
    );
  }
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ cursor: 'grab', display: 'flex', alignItems: 'center', padding: "0 3px", alignSelf: "stretch", backgroundColor: theme.palette.grey[100] }}
              onMouseEnter={props.handleSidePanelHoverEnd}
            >
                <DragIndicator color="action" />
            </Box>
      
            <div style={{ flex: 1, minWidth: 0, alignSelf: "stretch" }}>
              <TabItem tab={item.data as Tab} {...rest} />
            </div>
        </Box>
    </div>
  );
}


export function TabList(props: TabListProps) {
  const {
    flatTabList,
    previewTabId,
    originalTab,
    activeDragItem,
    onDragEnd,
    onDragStart,
    onDragOver,
  } = props;
  const theme = useTheme();
  const parentRef = useRef<HTMLDivElement>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  const virtualizer = useVirtualizer({
    count: flatTabList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = flatTabList[index];
      if (item.type === 'group') return 48;
      return 38;
    },
    overscan: 5,
  });
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
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
        <SortableContext items={flatTabList.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const item = flatTabList[virtualItem.index];
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
                  }}
                >
                  <SortableItem item={item} {...props} />
                </div>
              );
            })}
          </div>
        </SortableContext>
      </Box>

      <DragOverlay dropAnimation={null}>
        {activeDragItem ? (
          (() => {
            const item = flatTabList.find(i => i.id === activeDragItem.id);
            if (item && item.type === 'tab') {
              const tab = item.data as Tab;
              return (
                <Paper
                  elevation={4}
                  sx={{
                    width: parentRef.current?.getBoundingClientRect().width,
                  }}
                >
                  <TabItem
                    tab={tab}
                    previewTabId={previewTabId}
                    originalTab={originalTab}
                    onTabHover={() => {}}
                    onTabClick={() => {}}
                    onCloseTab={() => {}}
                  />
                </Paper>
              );
            }
            return null;
          })()
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
