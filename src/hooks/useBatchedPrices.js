import { useEffect, useRef, useState, useCallback } from 'react';
import apiFetch from '../utils/api';

// returns { prices, loading, error, refresh, getPriceFor }
export default function useBatchedPrices(symbols = [], opts = {}) {
  const { pollInterval = 5000, ttl = 5000 } = opts;

  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cacheRef = useRef(new Map());
  const mounted = useRef(true);
  const pendingFetch = useRef(null);

  // avoid undefined, empty symbols
  const cleanSymbols = symbols.filter(Boolean);

  useEffect(() => () => { mounted.current = false; }, []);

  const fetchBatch = useCallback(async (list) => {
    if (!list || list.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const unique = Array.from(new Set(list));
      const toFetch = unique.filter(s => {
        const cached = cacheRef.current.get(s);
        return !cached || (Date.now() - cached.ts > ttl);
      });

      // If nothing to fetch → return cached prices
      if (toFetch.length === 0) {
        const p = {};
        unique.forEach(s => {
          const c = cacheRef.current.get(s);
          if (c) p[s] = c.value;
        });
        if (mounted.current) setPrices(prev => ({ ...prev, ...p }));
        setLoading(false);
        return;
      }

      // ❌ REMOVE bulk request (your backend doesn't support it)
      // Instead: parallel per symbol
      await Promise.all(
        toFetch.map(async (symbol) => {
          try {
            const val = await apiFetch(`/api/v1/price/${encodeURIComponent(symbol)}`);

            // store in cache
            cacheRef.current.set(symbol, { value: val, ts: Date.now() });
          } catch (e) {
            console.warn("price fetch fail:", symbol, e);
          }
        })
      );

      // populate new price state
      const newPrices = {};
      unique.forEach((s) => {
        const c = cacheRef.current.get(s);
        if (c) newPrices[s] = c.value;
      });

      if (mounted.current) setPrices(prev => ({ ...prev, ...newPrices }));

    } catch (err) {
      console.error("useBatchedPrices error:", err);
      if (mounted.current) setError(err);
    } finally {
      if (mounted.current) setLoading(false);
    }

  }, [ttl]);

  const refresh = useCallback(() => {
    fetchBatch(cleanSymbols);
  }, [fetchBatch, cleanSymbols]);

  useEffect(() => {
    if (cleanSymbols.length) fetchBatch(cleanSymbols);

    if (pendingFetch.current) clearInterval(pendingFetch.current);

    pendingFetch.current = setInterval(() => {
      if (cleanSymbols.length) fetchBatch(cleanSymbols);
    }, pollInterval);

    return () => clearInterval(pendingFetch.current);
  }, [cleanSymbols, fetchBatch, pollInterval]);

  const getPriceFor = (symbol) => {
    return (
      prices[symbol] ||
      (cacheRef.current.get(symbol) && cacheRef.current.get(symbol).value) ||
      null
    );
  };

  return { prices, loading, error, refresh, getPriceFor };
}
