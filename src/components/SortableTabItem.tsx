import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TabItem } from './TabItem';
import { Tab } from '../types/Tab';
import { DragIndicator } from '@mui/icons-material';
import { Box } from '@mui/material';

interface SortableTabItemProps {
  id: string;
  tab: Tab;
  previewTabId: number | null;
  originalTab: Tab | null;
  onTabHover: (tabId: number) => void;
  onTabClick: (tabId: number) => void;
  onCloseTab: (tabId: number) => void;
  groupColor?: string;
}

export function SortableTabItem(props: SortableTabItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box ref={setNodeRef} style={style} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box {...attributes} {...listeners} sx={{ cursor: 'grab', display: 'flex', alignItems: 'center', paddingLeft: 1 }}>
        <DragIndicator color="action" />
      </Box>
      <div style={{ flex: 1, minWidth: 0 }}>
        <TabItem {...props} />
      </div>
    </Box>
  );
}
