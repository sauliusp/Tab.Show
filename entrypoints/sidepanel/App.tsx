import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<browser.tabs.Tab | null>(null);

  useEffect(() => {
    // Get current tab information when sidepanel opens
    const getCurrentTab = async () => {
      try {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (tab) {
          setCurrentTab(tab);
          setCurrentUrl(tab.url || '');
        }
      } catch (error) {
        console.error('Error getting current tab:', error);
      }
    };

    getCurrentTab();
  }, []);

  return (
    <div className="sidepanel">
      <header className="header">
        <h1>Narsheek</h1>
        <div className="status-indicator">
          <span className="status-dot active"></span>
          <span className="status-text">Active</span>
        </div>
      </header>
      
      <main className="content">
        <section className="current-page">
          <h2>Current Page</h2>
          <div className="url-display">
            <span className="url-text">{currentUrl || 'Loading...'}</span>
          </div>
        </section>

        <section className="actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary">
              Analyze Page
            </button>
            <button className="action-btn secondary">
              Save Note
            </button>
            <button className="action-btn secondary">
              View History
            </button>
          </div>
        </section>

        <section className="info">
          <h2>Extension Info</h2>
          <div className="info-item">
            <span className="label">Version:</span>
            <span className="value">1.0.0</span>
          </div>
          <div className="info-item">
            <span className="label">Status:</span>
            <span className="value">Running</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
