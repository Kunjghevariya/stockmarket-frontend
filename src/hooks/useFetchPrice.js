// src/hooks/useFetchPrice.js
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getCache, setCache } from '../utils/cache';

export default function useFetchPrice(symbol) {
  const [price, setPrice] = useState(null);
  const cancelRef = useRef();

  useEffect(() => {
    if (!symbol) return;
    const key = `price_${symbol}`;
    const cached = getCache(key);
    if (cached) {
      setPrice(cached);
      return;
    }

    const fetcher = async () => {
      try {
        cancelRef.current?.cancel?.();
        cancelRef.current = axios.CancelToken.source();
        const res = await axios.get(`/api/v1/price/${symbol}`, { cancelToken: cancelRef.current.token });
        setPrice(res.data);
        setCache(key, res.data, 5000);
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('price fetch error', e);
          setPrice(null);
        }
      }
    };

    fetcher();
    return () => cancelRef.current?.cancel('unmount');
  }, [symbol]);

  return price;
}
