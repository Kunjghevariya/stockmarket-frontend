// src/context/WatchlistContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiFetch from '../utils/api';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  const fetchWatchlist = useCallback(async () => {
    try {
      const resp = await apiFetch('/api/v1/watchlist/');

      if (Array.isArray(resp?.stocks)) setWatchlist(resp.stocks);
      else if (Array.isArray(resp?.stocks?.stocks)) setWatchlist(resp.stocks.stocks);
      else if (Array.isArray(resp)) setWatchlist(resp);
      else setWatchlist(resp?.stocks || []);
    } catch (e) {
      console.error('watchlist fetch failed', e);
    }
  }, []);

  useEffect(() => { fetchWatchlist(); }, [fetchWatchlist]);

  const addToWatchlist = useCallback(async (symbol) => {
    await apiFetch('/api/v1/watchlist/add', { method: 'POST', body: { stockSymbol: symbol } });
    await fetchWatchlist();
  }, [fetchWatchlist]);

  const removeFromWatchlist = useCallback(async (symbol) => {
    await apiFetch('/api/v1/watchlist/remove', { method: 'POST', body: { stockSymbol: symbol } });
    await fetchWatchlist();
  }, [fetchWatchlist]);

  const value = React.useMemo(
    () => ({
      watchlist,
      fetchWatchlist,
      addToWatchlist,
      removeFromWatchlist
    }),
    [watchlist, fetchWatchlist, addToWatchlist, removeFromWatchlist]
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlistCtx = () => useContext(WatchlistContext);
