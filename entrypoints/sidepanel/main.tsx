import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ColorSchemeProvider } from '../../src/contexts/ColorSchemeContext';
import { UserSettingsProvider } from '../../src/contexts/UserSettingsContext';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserSettingsProvider>
      <ColorSchemeProvider>
        <App />
      </ColorSchemeProvider>
    </UserSettingsProvider>
  </React.StrictMode>
);
