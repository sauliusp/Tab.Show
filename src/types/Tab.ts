export interface Tab {
  id: number | undefined;
  title?: string;
  url?: string;
  favIconUrl?: string;
  status?: string;
  lastAccessed?: number; // Timestamp of last access
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
}

export interface AvatarOverlay {
  type: string;
  color: string;
  position: string;
}
