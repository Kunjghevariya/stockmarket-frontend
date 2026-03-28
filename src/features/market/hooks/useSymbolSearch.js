import { useDeferredValue, useEffect, useState } from 'react';
import { searchSymbols } from '../api/marketApi';
import useDebouncedValue from '../../../shared/hooks/useDebouncedValue';

export default function useSymbolSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deferredQuery = useDeferredValue(query);
  const debouncedQuery = useDebouncedValue(deferredQuery, 250);

  useEffect(() => {
    let ignore = false;

    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      return undefined;
    }

    const runSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        const payload = await searchSymbols(debouncedQuery);
        if (!ignore) {
          setResults(Array.isArray(payload) ? payload : []);
        }
      } catch (searchError) {
        if (!ignore) {
          console.error('Search request failed', searchError);
          setResults([]);
          setError(searchError);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    runSearch();

    return () => {
      ignore = true;
    };
  }, [debouncedQuery]);

  return {
    results,
    loading,
    error,
  };
}
