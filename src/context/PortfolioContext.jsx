// src/context/PortfolioContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiFetch from '../utils/api';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState({ holdings: [], totalInvestment: 0 });

  const fetchPortfolio = useCallback(async () => {
    try {
      const resp = await apiFetch('/api/v1/portfolio/');
      // normalize
      if (resp?.holdings) setPortfolio(resp);
      else setPortfolio(resp || { holdings: [], totalInvestment: 0 });
    } catch (e) {
      console.error('portfolio fetch failed', e);
    }
  }, []);

  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

  const value = React.useMemo(() => ({ portfolio, fetchPortfolio }), [portfolio, fetchPortfolio]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

export const usePortfolioCtx = () => useContext(PortfolioContext);
