import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchQuote } from '../../features/market/api/marketApi';

export default function useQuotes(symbols, { pollInterval = 15000, ttl = 10000 } = {}) {
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());

  const normalizedSymbols = useMemo(
    () => Array.from(new Set((symbols || []).filter(Boolean).map((symbol) => symbol.toUpperCase()))),
    [symbols]
  );

  const refresh = useCallback(async () => {
    if (normalizedSymbols.length === 0) {
      setQuotes({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const now = Date.now();
      const symbolsToFetch = normalizedSymbols.filter((symbol) => {
        const cached = cacheRef.current.get(symbol);
        return !cached || now - cached.timestamp > ttl;
      });

      const quoteResponses = await Promise.allSettled(
        symbolsToFetch.map(async (symbol) => {
          const payload = await fetchQuote(symbol);
          return [symbol, payload];
        })
      );

      const nextQuotes = {};
      quoteResponses.forEach((result) => {
        if (result.status === 'fulfilled') {
          const [symbol, payload] = result.value;
          cacheRef.current.set(symbol, {
            payload,
            timestamp: Date.now(),
          });
        }
      });

      normalizedSymbols.forEach((symbol) => {
        const cached = cacheRef.current.get(symbol);
        if (cached) {
          nextQuotes[symbol] = cached.payload;
        }
      });

      setQuotes(nextQuotes);
    } catch (quoteError) {
      console.error('Failed to refresh quotes', quoteError);
      setError(quoteError);
    } finally {
      setLoading(false);
    }
  }, [normalizedSymbols, ttl]);

  useEffect(() => {
    refresh();

    if (!pollInterval || normalizedSymbols.length === 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      refresh();
    }, pollInterval);

    return () => window.clearInterval(timer);
  }, [normalizedSymbols.length, pollInterval, refresh]);

  const getQuote = useCallback((symbol) => quotes[symbol?.toUpperCase()] || null, [quotes]);

  return {
    quotes,
    loading,
    error,
    refresh,
    getQuote,
  };
}
