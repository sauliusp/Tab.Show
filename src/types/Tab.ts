export interface Tab {
  id: number | undefined;
  title?: string;
  url?: string;
  favIconUrl?: string;
  status?: string;
  lastAccessed?: number; // Timestamp of last access
  groupId?: number; // ID of the tab group this tab belongs to
}

export interface TabGroup {
  id: number;
  title?: string;
  color?: string;
  collapsed?: boolean;
  windowId: number;
}

export interface TabListItem {
  id: string; // Unique identifier for the list item
  type: 'tab' | 'group';
  data: Tab | TabGroup;
  parentId?: string; // For nested tabs within groups
}

export interface TabListState {
  items: Record<string, TabListItem>; // Object storing items by ID
  itemOrder: string[]; // Ordered array of item IDs
  groupExpansionState: Record<number, boolean>; // Track which groups are expanded
}

export interface TabVisualState {
  borderColor: string;
  backgroundColor: string;
  avatarOverlays: Array<{
    type: string;
    color: string;
    position: string;
  }>;
  textColor: string;
  opacity: number;
  avatarFilter: string;
  // New styling properties
  listItemStyles: React.CSSProperties;
  avatarStyles: React.CSSProperties;
  textStyles: React.CSSProperties;
  pseudoElementStyles: {
    before: React.CSSProperties;
    after?: React.CSSProperties;
  };
  hoverStyles: React.CSSProperties;
}

export interface AvatarOverlay {
  type: string;
  color: string;
  position: string;
}
