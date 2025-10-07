import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Link, Box, Tooltip } from '@mui/material';
import { ActionLinkButton } from '../../src/components/ActionLinkButton';
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
  const [hoverTooltipOpen, setHoverTooltipOpen] = React.useState(false);
  
  // Use the custom hook for tab management
  const {
    tabListState,
    originalTab,
    previewTabId,
    handleTabHover,
    handleSidePanelHoverEnd,
    handleTabClick,
    handleGroupToggle,
    handleDragEnd, // <-- Make sure to get this from the hook
    handleDragStart,
    handleDragOver
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
      }, 3000);
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
        onDragEnd={handleDragEnd} // <-- Pass it here
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
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
        
        <ActionLinkButton
          href="#"
          label="Tell a Friend 😊"
          title="Copy Chrome Web Store link"
          overrideTitle="Link copied ✅ - you can paste it anywhere"
          extraOpen={showCopiedTooltip}
          enterDelay={500}
          placement="top"
          onClick={handleTellAFriend}
          onMouseEnter={handleSidePanelHoverEnd}
        />

        
        <ActionLinkButton
          href={EXTENSION_URLS.FEATURE_REQUEST}
          target="_blank"
          rel="noopener noreferrer"
          label="Suggest Feature"
          title="Tell me how I could make the product more useful to you"
          enterDelay={500}
          placement="top"
          onMouseEnter={handleSidePanelHoverEnd}
        />
      </Box>
    </div>
  );
}

export default App;
