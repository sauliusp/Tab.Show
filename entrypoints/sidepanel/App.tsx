import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import { LightbulbOutlined } from '@mui/icons-material';
import { useTabs } from '../../src/hooks/useTabs';
import { Header } from '../../src/components/Header';
import { TabList } from '../../src/components/TabList';
import { tabService } from '../../src/services/TabService';
import { clearVisualStateCache } from '../../src/utils/tabVisualState';
import { PerformanceMetrics } from '../../src/components/PerformanceMetrics';
import './App.css';

function App() {
  const theme = useTheme();
  
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

  const handleSuggestFeature = () => {
    // Open a new tab with a feature suggestion form
    // You can replace this URL with your actual feature suggestion form
    window.open('https://github.com/your-username/tabglance/issues/new?template=feature_request.md', '_blank');
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

      {/* Floating Action Button for Feature Suggestions */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleSuggestFeature}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          borderRadius: 2,
          boxShadow: 2,
          textTransform: 'none',
          fontWeight: '600',
          backgroundColor: 'background.paper',  // Add this line
          backdropFilter: 'blur(8px)',  
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            borderColor: 'primary.main',
            boxShadow: 4,
            transform: 'translateY(-2px)',
          },
          '&:active': {
            backgroundColor: 'primary.dark',
            borderColor: 'primary.dark',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        Suggest a Feature
      </Button>
    </div>
  );
}

export default App;
