export interface Tab {
  id: number | undefined;
  title?: string;
  url?: string;
  favIconUrl?: string;
  status?: string;
  lastAccessed?: number; // Timestamp of last access
  groupId?: number; // ID of the tab group this tab belongs to
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
