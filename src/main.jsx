// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { PortfolioProvider } from './context/PortfolioContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <WatchlistProvider>
        <PortfolioProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PortfolioProvider>
      </WatchlistProvider>
    </AuthProvider>
  </React.StrictMode>
);
