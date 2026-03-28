import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '../auth/AuthContext';
import { fetchPortfolio } from './api/portfolioApi';

const PortfolioContext = createContext(null);

const EMPTY_PORTFOLIO = {
  holdings: [],
  totalInvestment: 0,
  totalQuantity: 0,
  holdingsCount: 0,
};

export function PortfolioProvider({ children }) {
  const { status } = useAuth();
  const [portfolio, setPortfolio] = useState(EMPTY_PORTFOLIO);
  const [loading, setLoading] = useState(false);

  const refreshPortfolio = useCallback(async () => {
    if (status !== 'authenticated') {
      setPortfolio(EMPTY_PORTFOLIO);
      return;
    }

    setLoading(true);
    try {
      const payload = await fetchPortfolio();
      setPortfolio({
        ...EMPTY_PORTFOLIO,
        ...payload,
        holdings: Array.isArray(payload?.holdings) ? payload.holdings : [],
      });
    } catch (error) {
      console.error('Failed to fetch portfolio', error);
      setPortfolio(EMPTY_PORTFOLIO);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    refreshPortfolio();
  }, [refreshPortfolio]);

  const value = useMemo(
    () => ({
      portfolio,
      loading,
      refreshPortfolio,
    }),
    [loading, portfolio, refreshPortfolio]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const value = useContext(PortfolioContext);

  if (!value) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }

  return value;
}
