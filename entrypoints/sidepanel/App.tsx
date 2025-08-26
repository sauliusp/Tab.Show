import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import { useTabs } from '../../src/hooks/useTabs';
import { Header } from '../../src/components/Header';
import { TabList } from '../../src/components/TabList';
import './App.css';

function App() {
  const theme = useTheme();
  
  // Use the custom hook for tab management
  const {
    allTabs,
    originalTab,
    previewTabId,
    handleTabHover,
    handleTabHoverEnd,
    handleTabClick
  } = useTabs();
  
  // Popover state for "Under construction" message
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [popoverMessage, setPopoverMessage] = useState<string>('');

  // Handle popover for "Under construction" message
  const handlePopoverShow = (event: React.MouseEvent<HTMLElement>, message: string) => {
    setPopoverAnchor(event.currentTarget);
    setPopoverMessage(message);
    
    // Auto-hide after 2 seconds
    setTimeout(() => {
      setPopoverAnchor(null);
      setPopoverMessage('');
    }, 2000);
  };

  return (
    <div className="sidepanel">
      {/* Header with original tab information */}
      <Header originalTab={originalTab} />

      {/* Tab list */}
      <TabList
        allTabs={allTabs}
        previewTabId={previewTabId}
        originalTab={originalTab}
        onTabHover={handleTabHover}
        onTabHoverEnd={handleTabHoverEnd}
        onTabClick={handleTabClick}
        onShowPopover={handlePopoverShow}
      />
      
      {/* Popover for "Under construction" message */}
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{
          '& .MuiPopover-paper': {
            backgroundColor: theme.palette.warning.main,
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }
        }}
      >
        {popoverMessage}
      </Popover>
    </div>
  );
}

export default App;
