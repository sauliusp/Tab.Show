import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Link, Box, Tooltip } from '@mui/material';
import { useTabs } from '../../src/hooks/useTabs';
import { Header } from '../../src/components/Header';
import { TabList } from '../../src/components/TabList';
import { tabService } from '../../src/services/TabService';
import { clearVisualStateCache } from '../../src/utils/tabVisualState';
import { PerformanceMetrics } from '../../src/components/PerformanceMetrics';
import { EXTENSION_URLS } from '../../src/parameters';
import './App.css';

function App() {
  const theme = useTheme();
  const [showCopiedTooltip, setShowCopiedTooltip] = React.useState(false);
  
  // Use the custom hook for tab management
  const {
    tabListState,
    originalTab,
    previewTabId,
    handleTabHover,
    handleSidePanelHoverEnd,
    handleTabClick,
    handleGroupToggle
  } = useTabs();

  // Clear visual state cache when theme changes to prevent stale cached values
  React.useEffect(() => {
    clearVisualStateCache();
  }, [theme]);

  const handleTellAFriend = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      await navigator.clipboard.writeText(EXTENSION_URLS.CHROME_WEB_STORE);
      setShowCopiedTooltip(true);
      // Hide tooltip after 2 seconds
      setTimeout(() => {
        setShowCopiedTooltip(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleCloseTab = async (tabId: number) => {
    try {
      const success = await tabService.closeTab(tabId);
      if (success) {
        console.log(`Successfully closed tab ${tabId}`);
        // The tab list will automatically update through the useTabs hook
        // since it's listening to browser tab events
      } else {
        console.error(`Failed to close tab ${tabId}`);
      }
    } catch (error) {
      console.error(`Error closing tab ${tabId}:`, error);
    }
  };


  return (
    <div className="sidepanel" onMouseLeave={handleSidePanelHoverEnd}>
      {/* Header with original tab information */}
      <Header originalTab={originalTab} />

      {/* Tab list */}
      <TabList
        tabListState={tabListState}
        previewTabId={previewTabId}
        originalTab={originalTab}
        onTabHover={handleTabHover}
        onTabClick={handleTabClick}
        onCloseTab={handleCloseTab}
        onGroupToggle={handleGroupToggle}
      />

      {/* Performance metrics (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMetrics />
      )}

      {/* Floating Action Buttons */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 12, // 16 * 0.75 = 12
          right: 12,  // 16 * 0.75 = 12
          zIndex: 1000,
          display: 'flex',
          gap: 1.5, // 2 * 0.75 = 1.5
          flexDirection: 'row',
        }}
       >
         {/* Tell a Friend Button */}
         <Tooltip
           title="✅ Link copied - you can paste it anywhere"
           open={showCopiedTooltip}
           placement="top"
           arrow
         >
           <Link
             href="#"
             onClick={handleTellAFriend}
             title="Share Tab.Show with friends"
             onMouseEnter={handleSidePanelHoverEnd}
             sx={{
               display: 'inline-flex',
               alignItems: 'center',
               gap: 0.75, // 1 * 0.75 = 0.75
               px: 1.5,   // 2 * 0.75 = 1.5
               py: 0.75,  // 1 * 0.75 = 0.75
               borderRadius: 1.5, // 2 * 0.75 = 1.5
               boxShadow: 1.5,    // 2 * 0.75 = 1.5
               textTransform: 'none',
               fontWeight: '600',
               textDecoration: 'none',
               backgroundColor: 'background.paper',
               backdropFilter: 'blur(8px)',
               border: '1px solid',
               borderColor: 'secondary.main',
               color: 'secondary.main',
               fontSize: '0.75rem', // Reduced font size
               '&:hover': {
                 backgroundColor: 'primary.main',
                 color: 'primary.contrastText',
                 borderColor: 'primary.main',
                 boxShadow: 3, // 4 * 0.75 = 3
                 transform: 'translateY(-1.5px)', // -2 * 0.75 = -1.5
                 textDecoration: 'none',
               },
               '&:active': {
                 backgroundColor: 'primary.dark',
                 borderColor: 'primary.dark',
               },
               transition: 'all 0.2s ease-in-out',
             }}
           >
             Tell a Friend 😊
           </Link>
         </Tooltip>

         {/* Suggest a Feature Button */}
         <Link
           href={EXTENSION_URLS.FEATURE_REQUEST}
           target="_blank"
           rel="noopener noreferrer"
           title="Open Featurebase to suggest features"
           onMouseEnter={handleSidePanelHoverEnd}
           sx={{
             display: 'inline-flex',
             alignItems: 'center',
             gap: 0.75, // 1 * 0.75 = 0.75
             px: 1.5,   // 2 * 0.75 = 1.5
             py: 0.75,  // 1 * 0.75 = 0.75
             borderRadius: 1.5, // 2 * 0.75 = 1.5
             boxShadow: 1.5,    // 2 * 0.75 = 1.5
             textTransform: 'none',
             fontWeight: '600',
             textDecoration: 'none',
             backgroundColor: 'background.paper',
             backdropFilter: 'blur(8px)',
             border: '1px solid',
             borderColor: 'secondary.main',
             color: 'secondary.main',
             fontSize: '0.75rem', // Reduced font size
             '&:hover': {
               backgroundColor: 'primary.main',
               color: 'primary.contrastText',
               borderColor: 'primary.main',
               boxShadow: 3, // 4 * 0.75 = 3
               transform: 'translateY(-1.5px)', // -2 * 0.75 = -1.5
               textDecoration: 'none',
             },
             '&:active': {
               backgroundColor: 'primary.dark',
               borderColor: 'primary.dark',
             },
             transition: 'all 0.2s ease-in-out',
           }}
         >
           Suggest Feature
         </Link>
      </Box>
    </div>
  );
}

export default App;
