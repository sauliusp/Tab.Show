import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ColorSchemeProvider } from '../../src/contexts/ColorSchemeContext';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorSchemeProvider>
      <App />
    </ColorSchemeProvider>
  </React.StrictMode>
);
