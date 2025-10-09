import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface TabItemActionButtonProps {
  tabId: number;
  onCloseTab: (tabId: number) => void;
  iconColor?: string;
}

export const TabItemActionButton = React.memo(({ tabId, onCloseTab, iconColor }: TabItemActionButtonProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent tab selection when clicking menu button
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCloseTab = () => {
    handleMenuClose();
    onCloseTab(tabId);
  };

  return (
    <>
      <IconButton
        edge="end"
        onClick={handleMenuOpen}
        sx={{
          paddingY: 0,
          flexShrink: 0,
          minWidth: '32px',
          minHeight: '32px',
          ...(iconColor ? { color: iconColor } : {})
        }}
      >
        <MoreVertIcon />
      </IconButton>

      {/* Menu for tab actions */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        onClick={(event) => event.stopPropagation()}
      >
        <MenuItem onClick={handleCloseTab}>
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          Close Tab
        </MenuItem>
      </Menu>
    </>
  );
});
