import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  addToWatchlist as addToWatchlistRequest,
  fetchWatchlist as fetchWatchlistRequest,
  removeFromWatchlist as removeFromWatchlistRequest,
} from '../market/api/marketApi';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { status } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshWatchlist = useCallback(async () => {
    if (status !== 'authenticated') {
      setWatchlist([]);
      return;
    }

    setLoading(true);
    try {
      const payload = await fetchWatchlistRequest();
      setWatchlist(Array.isArray(payload?.stocks) ? payload.stocks : []);
    } catch (error) {
      console.error('Failed to fetch watchlist', error);
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    refreshWatchlist();
  }, [refreshWatchlist]);

  const addToWatchlist = useCallback(
    async (symbol) => {
      const normalizedSymbol = symbol.trim().toUpperCase();
      if (!normalizedSymbol) {
        return;
      }

      setWatchlist((current) =>
        current.includes(normalizedSymbol) ? current : [normalizedSymbol, ...current]
      );

      try {
        const payload = await addToWatchlistRequest(normalizedSymbol);
        setWatchlist(Array.isArray(payload?.stocks) ? payload.stocks : []);
      } catch (error) {
        console.error('Failed to add symbol to watchlist', error);
        await refreshWatchlist();
        throw error;
      }
    },
    [refreshWatchlist]
  );

  const removeFromWatchlist = useCallback(
    async (symbol) => {
      const normalizedSymbol = symbol.trim().toUpperCase();
      setWatchlist((current) => current.filter((item) => item !== normalizedSymbol));

      try {
        const payload = await removeFromWatchlistRequest(normalizedSymbol);
        setWatchlist(Array.isArray(payload?.stocks) ? payload.stocks : []);
      } catch (error) {
        console.error('Failed to remove symbol from watchlist', error);
        await refreshWatchlist();
        throw error;
      }
    },
    [refreshWatchlist]
  );

  const value = useMemo(
    () => ({
      watchlist,
      loading,
      refreshWatchlist,
      addToWatchlist,
      removeFromWatchlist,
    }),
    [addToWatchlist, loading, refreshWatchlist, removeFromWatchlist, watchlist]
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const value = useContext(WatchlistContext);

  if (!value) {
    throw new Error('useWatchlist must be used within WatchlistProvider');
  }

  return value;
}
